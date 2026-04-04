"use client"
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconCheck } from "@tabler/icons-react";
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
      <section className="p-3 my-2 md:my-3">
        <Search
          valor={query}
          onChange={setQuery}
          resultados={filtrados.length}
        />
      </section>
      <section className="p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[1500px] mx-auto">
        {filtrados.map((producto) => (
          <Card
            key={producto.id}
            className="border-muted-foreground/10 border rounded-xs hover:border-primary/80 min-h-40 transition-all duration-200 ease-in-out max-w-2xl md:max-w-xs"
          >
            <CardHeader className="space-y-6 flex flex-row justify-between">
              <CardTitle className="whitespace-nowrap overflow-hidden text-ellipsis leading-relaxed tracking-tight text-slate-700 dark:text-slate-200 text-lg">
                {producto.nombre}
              </CardTitle>
              <Badge
                className="ml-2 leading-tight text-xs text-muted-foreground text-pretty tracking-tight"
                variant="outline"
              >
                {producto.categoria?.nombre ?? "n/a"}
              </Badge>
            </CardHeader>
            <CardContent className="">
              <span className="text-slate-700 dark:text-slate-200 text-lg md:text-xl font-medium">
                AR$
                {producto.precioVenta.toLocaleString("es-AR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
            </CardContent>
            <CardFooter className="border-none bg-transparent">
              <Button className="w-full rounded-xs py-4 leading-tight tracking-tight cursor-pointer">
                <IconCheck stroke={2} className='size-5'/>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}
