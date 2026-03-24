"use server"
import type { IngresosHoy, Ganancias, ProductosStats, VentasPorHora } from "@/types/dashboard.type"
import { prisma } from "@/lib/prisma"

/**
 * Devuelve el primer y último instante del “día de hoy” en la zona horaria del servidor.
 * Sirve para filtrar `Venta.createdAt`: solo filas cuyo timestamp cae entre esas dos fechas.
 * Nota: en producción el servidor suele estar en UTC; si el negocio es en Argentina,
 * más adelante podés afinar esto (por ejemplo con librerías de fechas o guardando el día en UTC).
 */
function rangoHoy(): { inicio: Date; fin: Date } {
  const inicio = new Date()
  inicio.setHours(0, 0, 0, 0) // 00:00:00.000 del día actual

  const fin = new Date()
  fin.setHours(23, 59, 59, 999) // 23:59:59.999 del mismo día

  return { inicio, fin }
}

/**
 * Prisma guarda montos como `Decimal` (tipo de base de datos, más preciso que float).
 * Los componentes de React y el JSON no llevan bien ese tipo, así que lo pasamos a `number`
 * antes de devolverlo. Si viene `null` (sin ventas), tratamos como 0.
 */
function aNumero(value: unknown): number {
  if (value == null) return 0
  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (value as { toNumber: () => number }).toNumber === "function"
  ) {
    return (value as { toNumber: () => number }).toNumber()
  }
  return Number(value)
}

/**
 * Suma todos los `total` de ventas de hoy y cuenta cuántas ventas hubo.
 * `aggregate` hace el trabajo en la base (no trae fila por fila), así es eficiente.
 */
export async function getIngresosHoy(): Promise<IngresosHoy> {
  const { fin, inicio } = rangoHoy()

  const agg = await prisma.venta.aggregate({
    where: { createdAt: { gte: inicio, lte: fin } },
    _sum: { total: true },
    _count: true,
  })

  return {
    monto: aNumero(agg._sum.total),
  
    // Cuántas filas de `venta` cumplen el filtro de fecha (una venta = un registro).
    cantidadVentas: agg._count,
  }
}
export async function getGanancias(){

}
export async function getProductosStats(): Promise<ProductosStats>{
  const [totalActivos, paraBajoStock] = await Promise.all([
    prisma.producto.count({where: {activo: true} }),
    prisma.producto.findMany({
      where: {activo: true},
      select:{stock: true, stockMinimo: true},
    }),
  ])
  const bajoStock = paraBajoStock.filter((p) => p.stock <= p.stockMinimo).length;
  return {
    totalActivos,
    bajoStock,
  }
}
export async function getVentasPorHora(){}