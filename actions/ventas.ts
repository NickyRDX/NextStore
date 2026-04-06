"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ItemCarrito } from "@/types/ventas.type";
import { createClient } from "@/lib/supabase/server";
import { toast } from "sonner";

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
  } catch (e) {
    console.error(e);
    toast.error(e as string ?? "Error al vender productos");
  }
}
