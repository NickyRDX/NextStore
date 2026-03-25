export type IngresosHoy = {
  monto: number;
  cantidadVentas: number;
}
export type ProductosStats = {
  totalActivos: number;
  bajoStock: number;
};
export type Ganancias = {
  montoGanancia: number;
  margenPorcentaje: number
}

export type VentasPorHora = {
  hora: string;
  monto: number
}

/* Por qué cada tipo
IngresosHoy — mapea al retorno de getIngresosHoy(). monto es la suma de Venta.total del día (convertida de Decimal a number). Agregué cantidadVentas porque es un dato que sale gratis del mismo query y lo podés mostrar en el footer de CardIngresos en lugar del texto estático actual.

GananciaHoy — mapea a getGananciaHoy(). Tu CardGanancias muestra un porcentaje ("12.5%"), no un monto en pesos. Entonces conviene devolver ambos: la ganancia absoluta en pesos (suma de Venta.ganancia) y el margenPorcentaje ya calculado en el server (ganancia / ingresos * 100). Así el componente solo renderiza, sin lógica de cálculo.

ProductosStats — mapea a getProductosStats(). totalActivos alimenta CardProductos (el "4000" hardcodeado) y bajoStock alimenta CardBajoStock (el "0" hardcodeado). Ambos salen de un count sobre Producto con filtros activo: true y stock <= stockMinimo.

VentaPorHora — cada elemento del array que devuelve getVentasPorHora(). Tu Grafica.tsx recibe un array como chartData; cada fila tendrá hora (ej: "08:00", "09:00") y monto (total vendido en esa hora). Esto reemplaza el array placeholder de desktop/mobile que tenés ahora. */

/* actions/dashboard.ts          types/dashboard.ts         componentes
─────────────────          ──────────────────         ───────────
getIngresosHoy()    →  retorna IngresosHoy      →  <CardIngresos />
getGananciaHoy()    →  retorna GananciaHoy      →  <CardGanancias />
getProductosStats() →  retorna ProductosStats   →  <CardProductos /> + <CardBajoStock />
getVentasPorHora()  →  retorna VentaPorHora[]   →  <Grafica /> */