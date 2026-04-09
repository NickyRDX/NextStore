"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { ProveedorFormDato } from "@/app/(router)/(principal)/proveedores/components/proveedor.form"
import type { ProveedorConVisita } from "@/types/proveedor.type"

export async function getProveedores(): Promise<ProveedorConVisita[]> {
  const proveedores = await prisma.proveedor.findMany({
    include: {
      visitas: {
        where: { estado: "PENDIENTE" },
        orderBy: { fecha: "asc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return proveedores.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    empresa: p.empresa,
    telefono: p.telefono,
    email: p.email,
    direccion: p.direccion,
    notas: p.notas,
    proximaVisita: p.visitas[0]?.fecha ?? null,
  }))
}

export async function crearProveedor(
  data: ProveedorFormDato
): Promise<{ success: boolean; error?: string }> {
  try {
    const proveedor = await prisma.proveedor.create({
      data: {
        nombre: data.nombre,
        empresa: data.empresa?.trim() || null,
        telefono: data.telefono?.trim() || null,
        email: data.email?.trim() || null,
        direccion: data.direccion?.trim() || null,
        notas: data.notas?.trim() || null,
      },
    })

    if (data.fechaVisita) {
      await prisma.visitaProveedor.create({
        data: {
          proveedorId: proveedor.id,
          fecha: data.fechaVisita,
          notas: data.notasVisita?.trim() || null,
          estado: "PENDIENTE",
        },
      })
    }

    revalidatePath("/proveedores")
    return { success: true }
  } catch (error) {
    console.error("Error al crear proveedor:", error)
    return {
      success: false,
      error: "No se pudo crear el proveedor. Intentá de nuevo.",
    }
  }
}
