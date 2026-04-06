"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ItemCarrito } from "@/types/ventas.type";
import { createClient } from "@/lib/supabase/server";
export async function getVentas(x: ItemCarrito[]) {
  //0. OBTENER EL USUARIO AUTENTICADO
  const s = await createClient();
  const {
    data: { user },
  } = await s.auth.getUser();
  try {
    if (!user) {
      throw new Error("Usuario no autenticado");
    }
    const perfil = await prisma.perfil.findUnique({
      where: { authId: user.id },
    });
    if (!perfil) {
      throw new Error("Perfil no encontrado");
    }
    //1. BUSCAR LOS PRODUCTOS DESDE LA DB
    const productos = await prisma.producto.findMany({
      where: { id: { in: x.map((i) => i.productoId) } },
    });
    /* Por cada producto que se quiere vender:
    - busca el producto en la lista
    - si el stock es menor a la cantidad pedida
    - si el stock es menor a la cantidad pedida
    → retorna error con el nombre del producto
    → la venta NO se crea
 */
    for(const i of x){
      const q = productos.find((d) => d.id === i.productoId)!;
      if(q.stock < i.cantidad){
        return{
          ok: false,
          error: `No hay stock: ${q.nombre}, reponer ahora!!!`,
        }
      }
    }
    //2. CALCULAR TOTALES
    let total = 0;
    let costoTotal = 0;
    const items = x.map((i) => {
      const producto = productos.find((p) => p.id === i.productoId)!;
      const precioUnitario = Number(producto.precioVenta);
      const costoUnitario = Number(producto.precioCosto);
      total += precioUnitario * i.cantidad;
      costoTotal += costoUnitario * i.cantidad;
      return {
        productoId: i.productoId,
        cantidad: i.cantidad,
        precioUnitario,
        costoUnitario,
      };
    });
    const ganancia = total - costoTotal;
    //3. CREAR LA VENTA EN LA DB
    await prisma.venta.create({
      data: {
        vendedorId: perfil.id,
        total,
        costoTotal,
        ganancia,
        items: {
          create: items,
        },
      },
    });
    //4. DESCONTAR EL STOCK DE LOS PRODUCTOS
    /* Por cada producto vendido:
    prisma busca el producto por id
        ↓
    resta item.cantidad al campo stock
        ↓
    stock: 237 → 236 (si vendiste 1 unidad)
    */
    for (const i of x) {
      await prisma.producto.update({
        where: { id: i.productoId },
        data: { stock: { decrement: i.cantidad } },
      });
    }
    revalidatePath("/dashboard");
    revalidatePath("/productos");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e as string };
  }
}