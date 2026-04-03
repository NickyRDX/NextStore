"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProductSearch } from "@/hooks/useProductSearch";
import Search from "./components/Search/Search";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function VentasPage() {
  const { query, setQuery, filtrados, loading, error, total } =
    useProductSearch();
  if (loading) return (
    <div className="w-full max-w-7xl mx-auto flex justify-center items-center h-full">
      <Spinner className="size-9 text-blue-400" />
    </div>
  );
  if (error) return toast.error(error ?? "Error al cargar los productos");
  return (
    <>
      <section className="p-3">
        <Search
          valor={query}
          onChange={setQuery}
          resultados={filtrados.length}
        />
      </section>
      <section className="p-3 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Registrar Venta</h1>
        <p className="text-sm text-gray-500 mb-2">
          {total} productos disponibles
        </p>
        <ul className="mt-4 space-y-2">
          {filtrados.map((producto) => (
            <li
              onClick={() => {
                console.log("producto seleccionado:", producto);
              }}
              key={producto.id}
              className="p-3 border rounded-md flex justify-between items-center hover:bg-slate-100 cursor-pointer"
            >
              <div>
                <p>{producto.nombre}</p>
              </div>
              <div>
                <p className='text-red-500'>
                  {producto.categoria?.nombre  ?? "Sin categoría"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
