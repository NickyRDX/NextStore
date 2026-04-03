import { ProductSearch } from "@/types/productSearch.type";
import { useState, useEffect, useMemo } from "react";
import { buscarProductos } from "@/lib/search";
import { toast } from "sonner";

export function useProductSearch() {
  //1. Guardamos TODOS los productos que vienen de la base de datos
  const [productos, setProductos] = useState<ProductSearch[]>([]);
  //2. Guardamos lo que el empleado escribe
  const [query, setQuery] = useState<string>("");
  //3. Estados de carga y error
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //4. Cargar productos UNA SOLA VEZ cuando el componente monta
  useEffect(() => {
    async function loadProductos() {
      try {
        setLoading(true);
        const resp = await fetch('/api/products');
        if(!resp.ok){
          throw new Error('No se pudo cargar los productos')
        }
        const datos : ProductSearch[] = await resp.json()
        setProductos(datos)
      } catch (e) {
        console.log(e);
        setError('Error al cargar los productos')
        toast.error('Error al cargar los productos')
      } finally {
        setLoading(false);
      }
    }
    loadProductos()
  }, []); //[] = solo se ejecuta una vez al montar
  //5. useMemo: solo recalcula el filtro cuando cambie el query o productos
  //Esto evita re-calcular en cada render sin motivo -> PERFORMANCE
  const filtrados = useMemo(()=> buscarProductos(productos, query),[productos, query])
  return {
    query,
    setQuery,
    filtrados,
    loading,
    error,
    total: productos.length
  }
}
