// "use server" le dice a Next.js que todo el código de este archivo
// se ejecuta SOLO en el servidor (nunca en el navegador del usuario).
// Esto permite acceder a la base de datos de forma segura.
"use server"

// revalidatePath: le dice a Next.js que "tire a la basura" el caché de una página
// para que la próxima visita traiga datos frescos desde la base de datos.
// Ejemplo: después de crear un producto, la lista de productos debe actualizarse.
import { revalidatePath } from "next/cache"

// prisma: es el cliente de base de datos. Con él hacemos consultas (leer, crear,
// actualizar, borrar datos) de forma segura y con autocompletado de TypeScript.
import { prisma } from "@/lib/prisma"

// ProductFormDato: es el tipo (TypeScript) que describe qué campos trae el formulario
// al crear un producto. Ejemplo: { nombre: "Yerba", precioCosto: 1000, ... }
import { ProductFormDato } from "@/app/(router)/(principal)/productos/components/product.form"

// Cuántos productos se muestran por página.
// Con PER_PAGE = 10, la página 1 muestra productos 1-10, la página 2 muestra 11-20, etc.
const PER_PAGE = 10

// ─── FUNCIÓN: getProductos ────────────────────────────────────────────────────
// Trae una página de productos activos desde la base de datos.
//
// Parámetro:
//   page (opcional, por defecto = 1): el número de página que queremos.
//   Ejemplo de uso:
//     getProductos()            → trae la página 1
//     getProductos({ page: 3 }) → trae la página 3
//
// Retorna:
//   { productos: [...], total: 42, totalPages: 5 }
export async function getProductos({ page = 1 }: { page?: number } = {}) {
  // Calculamos cuántos registros "saltar" para llegar a la página correcta.
  // Ejemplo con PER_PAGE = 10:
  //   página 1 → skip = (1-1)*10 = 0  → trae del registro 1 al 10
  //   página 2 → skip = (2-1)*10 = 10 → trae del registro 11 al 20
  //   página 3 → skip = (3-1)*10 = 20 → trae del registro 21 al 30
  const skip = (page - 1) * PER_PAGE

  // Promise.all ejecuta las DOS consultas a la base de datos al mismo tiempo (en paralelo).
  // Esto es más rápido que ejecutarlas una por una.
  // Resultado: [lista de productos, cantidad total de productos activos]
  const [rawProductos, total] = await Promise.all([
    // Consulta 1: trae los productos de esta página
    prisma.producto.findMany({
      where: { activo: true },                               // solo productos no eliminados
      include: { categoria: { select: { nombre: true } } }, // trae solo el nombre de la categoría relacionada
      skip,                                                  // saltea los registros de páginas anteriores
      take: PER_PAGE,                                        // trae como máximo 10 productos
      orderBy: { createdAt: "desc" },                        // los más nuevos primero
    }),
    // Consulta 2: cuenta cuántos productos activos hay en total (para calcular las páginas)
    prisma.producto.count({ where: { activo: true } }),
  ])

  // Transformamos los datos crudos de la DB al formato que necesita la UI.
  // El ".map()" recorre cada producto y devuelve un objeto nuevo con los campos que queremos.
  //
  // Dos cosas importantes:
  //   1. p.categoria?.nombre ?? null
  //      El "?." (optional chaining) evita un error si categoria es null.
  //      El "?? null" devuelve null si el valor es undefined.
  //      Ejemplo: si el producto no tiene categoría → devuelve null
  //
  //   2. Number(p.precioCosto)
  //      Prisma devuelve los campos Decimal como un objeto especial, no como número JS.
  //      Lo convertimos con Number() para poder usarlos normalmente en la UI.
  //      Ejemplo: Number("1500.50") → 1500.5
  const productos = rawProductos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    categoria: p.categoria?.nombre ?? null,
    precioCosto: Number(p.precioCosto),
    precioVenta: Number(p.precioVenta),
    stock: p.stock,
    stockMinimo: p.stockMinimo,
  }))

  // Devolvemos los productos de esta página, el total general y la cantidad de páginas.
  // Math.ceil redondea hacia arriba para no perder la última página incompleta.
  // Ejemplo: 42 productos / 10 por página = 4.2 → Math.ceil(4.2) = 5 páginas
  return {
    productos,
    total,
    totalPages: Math.ceil(total / PER_PAGE),
  }
}

// ─── FUNCIÓN: crearProducto ───────────────────────────────────────────────────
// Recibe los datos del formulario y crea un nuevo producto en la base de datos.
//
// Parámetro:
//   data: los campos del formulario. Ejemplo:
//     { nombre: "Yerba Mate", categoria: "Infusiones", precioCosto: 800,
//       precioVenta: 1200, stock: 50, stockMinimo: 5 }
//
// Retorna:
//   Si todo salió bien:  { success: true }
//   Si hubo un error:    { success: false, error: "mensaje de error" }
//
// El tipo Promise<{ success: boolean; error?: string }> indica que:
//   - Es una función asíncrona (async → siempre retorna una Promise)
//   - Siempre devuelve { success: true/false }
//   - El campo "error" es opcional (solo aparece cuando algo falla)
export async function crearProducto(data: ProductFormDato): Promise<{ success: boolean; error?: string }> {
  // try/catch: intentamos ejecutar el código del bloque "try".
  // Si algo lanza un error (ej: la DB no responde, dato inválido), saltamos al bloque "catch".
  try {
    // La categoría es opcional. Empezamos asumiendo que no hay ninguna (null).
    let categoriaId: string | null = null

    // Si el usuario escribió una categoría en el formulario...
    // .trim() elimina espacios en blanco al inicio y al final.
    // Ejemplo: "  Frutas  " → "Frutas"   |   "   " → "" (cadena vacía = falsy, no entra al if)
    if (data.categoria?.trim()) {
      // upsert = "update or insert" (actualizar o insertar).
      // Busca si ya existe una categoría con ese nombre exacto:
      //   - Si YA existe → no hace nada (update: {})
      //   - Si NO existe → la crea (create: { nombre: ... })
      // Esto evita categorías duplicadas.
      // Ejemplo: si "Infusiones" ya existe en la DB, la reutiliza. Si no, la crea.
      const categoria = await prisma.categoria.upsert({
        where: { nombre: data.categoria.trim() },
        create: { nombre: data.categoria.trim() },
        update: {},
      })
      // Guardamos el ID de la categoría encontrada o recién creada.
      categoriaId = categoria.id
    }

    // Creamos el nuevo producto en la base de datos con todos sus datos.
    // "categoriaId" puede ser el ID de una categoría existente o null.
    // descripcion?.trim() || null:
    //   si la descripción es vacía o solo tiene espacios, guardamos null en vez de "".
    //   Ejemplo: "  " → null  |  "Producto fresco" → "Producto fresco"
    await prisma.producto.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion?.trim() || null,
        categoriaId,
        precioCosto: data.precioCosto,
        precioVenta: data.precioVenta,
        stock: data.stock,
        stockMinimo: data.stockMinimo,
      },
    })

    // Le decimos a Next.js que la página /productos tiene datos nuevos
    // y debe regenerarse la próxima vez que alguien la visite.
    revalidatePath("/productos")

    // Todo salió bien, devolvemos éxito.
    return { success: true }
  } catch (error) {
    // Si algo falló (error de red, DB caída, dato inválido, etc.),
    // lo registramos en la consola del servidor para poder debuggear.
    console.error("Error al crear producto:", error)

    // Devolvemos un objeto de error amigable para mostrarle al usuario en el formulario.
    return { success: false, error: "No se pudo crear el producto. Intentá de nuevo." }
  }
}
