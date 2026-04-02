import {ProductSearch} from '@/types/productSearch.type'

export function normalizarTexto(texto: string): string {
  return texto.toLowerCase().normalize("NFC").replace(/[\u0300-\u036f]/g, "").trim()
}

export function buscarProductos(
  productos: ProductSearch[],
  query: string
) : ProductSearch[]{
  // Si no escribio nada, mostrar todos
  if(!query.trim()) return productos;
  const normalizar = normalizarTexto(query)
  return productos.filter((x) =>{
    const normalizarNombre = normalizarTexto(x.nombre)
    // .includes() -> "el nombre del producto contiene los que busco?"
    return normalizarNombre.includes(normalizar)
  })
}