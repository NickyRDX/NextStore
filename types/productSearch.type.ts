export type ProductSearch = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: {nombre: string} | null
}