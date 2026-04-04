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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <section className='p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full max-w-[1600px] mx-auto'>
        {filtrados.map((producto) => (
          <Card key={producto.id} className='border-muted-foreground/20 border rounded-sm hover:border-primary/40 transition-all duration-200 ease-in-out max-w-2xl md:max-w-xs'>
            <CardHeader>
              <CardTitle className='text-pretty'>{producto.nombre}</CardTitle>
              <Badge variant="outline">
                {producto.categoria?.nombre ?? "n/a"}
              </Badge>
            </CardHeader>
            <CardContent>
              <span className="text-red-500">{
                producto.precioVenta}</span>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
