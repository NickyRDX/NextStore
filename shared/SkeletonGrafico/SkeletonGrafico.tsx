"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function SkeletonGrafico() {
  return (
    <Card className="border-muted-foreground/10 rounded-sm border-solid border">
      <CardHeader className="space-y-2">
        {/* Título: Ventas del día */}
        <Skeleton className="h-6 w-32" />
        {/* Descripción: Monto facturado por hora */}
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      
      <CardContent>
        {/* Contenedor del gráfico con aspecto similar al real */}
        <div className="aspect-2/1 md:aspect-3/1 w-full flex flex-col justify-end gap-4">
          {/* Líneas de la cuadrícula (CartesianGrid) simuladas */}
          <div className="w-full border-b border-muted/30 h-0" />
          <div className="w-full border-b border-muted/30 h-0" />
          <div className="w-full border-b border-muted/30 h-0" />
          <div className="w-full border-b border-muted/30 h-0" />
          
          {/* Simulación del área del gráfico (picos y valles) */}
          <div className="relative h-full w-full overflow-hidden">
             <Skeleton className="absolute bottom-0 left-0 w-full h-[40%] rounded-none opacity-20" />
             <div className="absolute bottom-0 left-0 w-full h-[40%] bg-linear-to-t from-muted/50 to-transparent" />
          </div>

          {/* Eje X (Horas) */}
          <div className="flex justify-between w-full pt-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full flex-col gap-2">
          {/* Total del día */}
          <Skeleton className="h-5 w-40" />
          {/* Texto de franjas horarias */}
          <Skeleton className="h-4 w-56" />
        </div>
      </CardFooter>
    </Card>
  );
}
