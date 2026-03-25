
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon } from "lucide-react";
import { connection } from 'next/server';
import {getGanancias} from '@/actions/dashboard'
export default async function CardGanancias() {
  await connection()
  const {margenPorcentaje, montoGanancia} = await getGanancias()
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <CardDescription className="text-pretty tracking-tight text-muted-foreground text-xs">
            Margen de Ganancias Reales
          </CardDescription>

          <Badge
            variant={`outline`}
            className="flex gap-1 items-center font-medium"
          >
            <TrendingUpIcon className="size-3 text-green-400" />
          </Badge>
        </div>
        <CardTitle className="text-slate-700 my-1.5 dark:text-slate-200 leading-relaxed tracking-tight text-3xl md:text-xl font-semibold text-pretty">
          {margenPorcentaje.toFixed(2)}%
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-pretty bg-transparent text-sm border-none text-muted-foreground leading-tight tracking-tighter">
        Este recuadro muestra el margen de ganancia real obtenido hoy en tu drugstore, calculando la proporción entre la ganancia neta y el total vendido. 
        Ganancia del día: $ {montoGanancia.toFixed(2)} · Representa la rentabilidad diaria sobre el total de ventas.
      </CardFooter>
    </Card>
  );
}
