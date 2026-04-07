import { IconFileDescription } from "@tabler/icons-react";
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
import { connection } from "next/server";
import { getGanancias } from "@/actions/dashboard";
export default async function CardGanancias() {
  await connection();
  const { margenPorcentaje, montoGanancia } = await getGanancias();
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <CardDescription className="text-pretty tracking-tight text-muted-foreground text-xs">
            Margen de Ganancias Reales
          </CardDescription>

          {/* <Badge
            className="flex gap-1 items-center size-8"
          >
            
            <IconFileDescription size={26} className='text-slate-700 dark:text-slate-200'/>
          </Badge> */}
          <div className="size-9 bg-sky-700/20 rounded-md flex items-center justify-center">
            <IconFileDescription size={24} className="text-sky-400" />
          </div>
        </div>
        <CardTitle className="text-slate-700 my-1.5 dark:text-slate-200 leading-relaxed tracking-tight text-3xl md:text-xl font-semibold text-pretty">
          {margenPorcentaje.toFixed(2)}%
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-pretty bg-transparent text-sm border-none text-muted-foreground leading-tight tracking-tighter">
        Este recuadro muestra el margen de ganancia real obtenido hoy en tu
        drugstore, calculando la proporción entre la ganancia neta y el total
        vendido. Margen de Ganancia del Drugstore: AR$ {montoGanancia.toFixed(2)}
      </CardFooter>
    </Card>
  );
}
