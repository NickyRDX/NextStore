import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {getIngresosHoy} from '@/actions/dashboard'
import { connection } from 'next/server';
import { IconCurrencyDollar } from '@tabler/icons-react';
export default async function CardIngresos() {
  await connection()
  const {cantidadVentas, monto} = await getIngresosHoy()
  console.log("Cantidad de ventas:", cantidadVentas)
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <CardDescription className="text-pretty tracking-tight text-muted-foreground text-sm">
            Capital Ingresado
          </CardDescription>

          {/* <Badge
            variant={`outline`}
            className="flex gap-1 items-center font-medium"
          >
            <TrendingUpIcon className="size-3 text-green-400" />
            AR$
          </Badge> */}
          <div className="size-9 bg-green-700/20 rounded-md flex items-center justify-center">
            <IconCurrencyDollar size={24} className="text-green-400" />
          </div>
        </div>
        <CardTitle className="text-slate-700 my-1.5 dark:text-slate-200 leading-relaxed tracking-tight text-3xl md:text-xl font-semibold text-pretty">
          AR${" "}
          {monto.toLocaleString("es-AR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-pretty bg-transparent text-sm border-none text-muted-foreground leading-tight tracking-tighter">
        Este recuadro muestra el monto total de ingresos obtenidos hoy a partir
        de todas las ventas registradas en tu drugstore. El capital ingresado
        refleja la suma bruta de dinero generado en el día.
        {/* Monitorear este valor te permite llevar un control diario sobre la entrada de dinero, evaluar el rendimiento comercial en tiempo real. */}
      </CardFooter>
    </Card>
  );
}
