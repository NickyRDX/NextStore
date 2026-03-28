"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema de validación para el producto
const productoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  codigoBarras: z.string().optional(),
  categoriaId: z.string().optional(),
  proveedorId: z.string().optional(),
  precioCosto: z.coerce.number().min(0, "El precio de costo no puede ser negativo"),
  precioVenta: z.coerce.number().min(0, "El precio de venta no puede ser negativo"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  stockMinimo: z.coerce.number().int().min(0, "El stock mínimo no puede ser negativo"),
  unidad: z.string().default("unidad"),
})

export async function crearProducto(formData: FormData) {
  // Simulación de delay para mostrar estado de carga
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const rawData = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    codigoBarras: formData.get("codigoBarras"),
    categoriaId: formData.get("categoriaId"),
    proveedorId: formData.get("proveedorId"),
    precioCosto: formData.get("precioCosto"),
    precioVenta: formData.get("precioVenta"),
    stock: formData.get("stock"),
    stockMinimo: formData.get("stockMinimo"),
    unidad: formData.get("unidad"),
  }

  const validatedData = productoSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  // Aquí iría la lógica de Prisma:
  // await prisma.producto.create({ data: validatedData.data })

  console.log("Producto creado:", validatedData.data)

  revalidatePath("/productos")
  return { success: true }
}

export async function getCategorias() {
  // Simulación de categorías
  return [
    { id: "1", nombre: "Bebidas" },
    { id: "2", nombre: "Golosinas" },
    { id: "3", nombre: "Cigarrillos" },
    { id: "4", nombre: "Almacén" },
  ]
}

export async function getProveedores() {
  // Simulación de proveedores
  return [
    { id: "1", nombre: "Coca Cola" },
    { id: "2", nombre: "Arcor" },
    { id: "3", nombre: "Massalin" },
  ]
}
