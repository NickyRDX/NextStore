export type ProductSearch = {
  id: number;
  nombre: string;
  precioVenta: number;
  stock: number;
  categoria: {nombre: string} | null
}