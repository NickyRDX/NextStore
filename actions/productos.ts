"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { ProductFormDato } from "@/app/(router)/(principal)/productos/components/product.form"

const PER_PAGE = 10

export async function getProductos({ page = 1 }: { page?: number } = {}) {
  const skip = (page - 1) * PER_PAGE

  const [rawProductos, total] = await Promise.all([
    prisma.producto.findMany({
      where: { activo: true },
      include: { categoria: { select: { nombre: true } } },
      skip,
      take: PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.producto.count({ where: { activo: true } }),
  ])

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

  return {
    productos,
    total,
    totalPages: Math.ceil(total / PER_PAGE),
  }
}

export async function crearProducto(data: ProductFormDato): Promise<{ success: boolean; error?: string }> {
  try {
    // Si el usuario escribió una categoría, la buscamos o creamos
    let categoriaId: string | null = null
    if (data.categoria?.trim()) {
      const categoria = await prisma.categoria.upsert({
        where: { nombre: data.categoria.trim() },
        create: { nombre: data.categoria.trim() },
        update: {},
      })
      categoriaId = categoria.id
    }

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

    revalidatePath("/productos")
    return { success: true }
  } catch (error) {
    console.error("Error al crear producto:", error)
    return { success: false, error: "No se pudo crear el producto. Intentá de nuevo." }
  }
}
