import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
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
    return NextResponse.json(
      proveedores.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        empresa: p.empresa,
        telefono: p.telefono,
        email: p.email,
        direccion: p.direccion,
        notas: p.notas,
        proximaVisita: p.visitas[0]?.fecha ?? null,
      }))
    )
  } catch {
    return NextResponse.json(
      { error: "Error al cargar los proveedores" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

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
          fecha: new Date(data.fechaVisita),
          notas: data.notasVisita?.trim() || null,
          estado: "PENDIENTE",
        },
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Error al crear el proveedor" },
      { status: 500 }
    )
  }
}
