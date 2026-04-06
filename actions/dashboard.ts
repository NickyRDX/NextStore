"use server";
import type {
  IngresosHoy,
  Ganancias,
  ProductosStats,
  VentasPorHora,
} from "@/types/dashboard.type";
import { prisma } from "@/lib/prisma";

/**
 * Devuelve el primer y último instante del “día de hoy” en la zona horaria del servidor.
 * Sirve para filtrar `Venta.createdAt`: solo filas cuyo timestamp cae entre esas dos fechas.
 * Nota: en producción el servidor suele estar en UTC; si el negocio es en Argentina,
 * más adelante podés afinar esto (por ejemplo con librerías de fechas o guardando el día en UTC).
 */
function rangoHoy(): { inicio: Date; fin: Date } {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0); // inicio del día calendario (hora local del servidor)

  const fin = new Date();
  fin.setHours(23, 59, 59, 999); // fin del mismo día

  return { inicio, fin };
}

/**
 * Prisma guarda montos como `Decimal` (tipo de base de datos, más preciso que float).
 * Los componentes de React y el JSON no llevan bien ese tipo, así que lo pasamos a `number`
 * antes de devolverlo. Si viene `null` (sin ventas), tratamos como 0.
 */
function aNumero(value: unknown): number {
  if (value == null) return 0;
  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (value as { toNumber: () => number }).toNumber === "function"
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

/**
 * Suma todos los `total` de ventas de hoy y cuenta cuántas ventas hubo.
 * `aggregate` hace el trabajo en la base (no trae fila por fila), así es eficiente.
 */
export async function getIngresosHoy(): Promise<IngresosHoy> {
  const { fin, inicio } = rangoHoy();

  const agg = await prisma.venta.aggregate({
    where: { createdAt: { gte: inicio, lte: fin } },
    _sum: { total: true },
    _count: true,
  });

  return {
    monto: aNumero(agg._sum.total),

    // Cuántas filas de `venta` cumplen el filtro de fecha (una venta = un registro).
    cantidadVentas: agg._count,
  };
}
export async function getGanancias(): Promise<Ganancias> {
  const { inicio, fin } = rangoHoy();
  const agg2 = await prisma.venta.aggregate({
    where: { createdAt: { gte: inicio, lte: fin } },
    _sum: { ganancia: true, total: true },
  });
  const totalVendidoHoy = aNumero(agg2._sum.total);
  const montoGanancia = aNumero(agg2._sum.ganancia);

  const margenPorcentaje =
    totalVendidoHoy > 0 ? (montoGanancia / totalVendidoHoy) * 100 : 0;

  return {
    montoGanancia,
    margenPorcentaje,
  };
}
export async function getProductosStats(): Promise<ProductosStats> {
  const [agg, paraBajoStock] = await Promise.all([
    prisma.producto.aggregate({
      where: { activo: true },
      _sum: { stock: true },
    }),
    prisma.producto.findMany({
      where: { activo: true },
      select: { stock: true, stockMinimo: true },
    }),
  ]);
  const bajoStock = paraBajoStock.filter(
    (p) => p.stock <= p.stockMinimo,
  ).length;
  return {
    totalActivos: agg._sum.stock ?? 0,
    bajoStock,
  };
}
/**
 * Ventas del día agrupadas por hora (0–23), para alimentar un gráfico (ej. `Grafica`).
 *
 * **Qué problema resuelve:** el dashboard quiere ver *cuánto se vendió en cada hora*,
 * no un solo total del día. Esta función devuelve 24 “cajitas” (una por hora), cada una
 * con una etiqueta legible (`"08:00"`) y el monto sumado de todas las ventas cuyo
 * `createdAt` cayó en esa hora.
 *
 * **Por qué no usamos `aggregate` como en ingresos:** Prisma no agrupa por hora en un solo
 * `aggregate` simple; hace falta traer las ventas del día (solo `createdAt` + `total`, liviano)
 * y sumar en memoria. Si un día tenés millones de ventas por día, se podría pasar a SQL
 * (`GROUP BY` por hora); para un drugstore típico esto suele alcanzar.
 *
 * **Map (acumulado):** clave = hora 0–23, valor = suma de `total` en esa hora. Un `Map` es
 * como un objeto especializado para contar por número; evita escribir `if (!arr[h]) arr[h]=0`.
 *
 * **Zona horaria:** `getHours()` usa la hora local del *servidor* (igual que `rangoHoy()`).
 * Si el servidor está en UTC y el negocio en Argentina, las “horas” del gráfico pueden no
 * coincidir con el reloj del local; es el mismo tema que el comentario de `rangoHoy()`.
 */
export async function getVentasPorHora(): Promise<VentasPorHora[]> {
  // Mismo “día calendario” que el resto del dashboard (00:00 → 23:59:59.999).
  const { fin, inicio } = rangoHoy();

  // Traemos todas las ventas de hoy, pero solo dos columnas: cuándo fue y cuánto sumó.
  // `select` reduce datos en red y memoria (no pedimos vendedor, items, etc.).
  const ventas = await prisma.venta.findMany({
    where: { createdAt: { gte: inicio, lte: fin } },
    select: { createdAt: true, total: true },
  });

  // Preparamos 24 entradas, todas en 0. Así las horas sin ventas aparecen con monto 0
  // en el gráfico en lugar de “desaparecer” del eje X.
  const acumulado = new Map<number, number>();
  for (let i = 0; i < 24; i++) acumulado.set(i, 0);

  // Por cada venta: leemos la hora del reloj (0–23) y sumamos su `total` a esa caja.
  // `aNumero` convierte el Decimal de Prisma a `number` para poder sumar sin rarezas.
  for (const v of ventas) {
    const fechaArgentina = new Date(v.createdAt.getTime() - 3 * 60 * 60 * 1000);
    const h = fechaArgentina.getHours();
    acumulado.set(h, (acumulado.get(h) ?? 0) + aNumero(v.total));
  }

  // Recharts (y similares) esperan un array de objetos planos: { hora, monto }.
  // Orden fijo 0→23 hace que el eje X siempre sea “00:00” … “23:00”.
  const filas: VentasPorHora[] = [];
  for (let i = 0; i < 24; i++) {
    filas.push({
      // padStart(2,"0") → 8 → "08" para que quede "08:00" y no "8:00"
      hora: `${String(i).padStart(2, "0")}:00`,
      monto: acumulado.get(i) ?? 0,
    });
  }

  return filas;
}
