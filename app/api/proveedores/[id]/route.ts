import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await req.json()

    await prisma.proveedor.update({
      where: { id },
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
          proveedorId: id,
          fecha: new Date(data.fechaVisita),
          notas: data.notasVisita?.trim() || null,
          estado: "PENDIENTE",
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.proveedor.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    )
  }
}
