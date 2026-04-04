"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { VentasPorHora } from "@/types/dashboard.type";

const chartConfig = {
  monto: {
    label: "Ventas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type GraficaProps = {
  /** Filas `{ hora, monto }` que devuelve `getVentasPorHora()` (Server Action). */
  data: VentasPorHora[];
};

export default function Grafica({ data }: GraficaProps) {
  const totalDia = data.reduce((acc, row) => acc + row.monto, 0);

  return (
    <Card className="border-muted-foreground/10 rounded-sm border-solid border">
      <CardHeader>
        <CardTitle>Ventas del día</CardTitle>
        <CardDescription>
          Monto facturado por hora (hoy)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-2/1 md:aspect-3/1 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hora"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="monto"
              type="natural"
              fill="var(--color-monto)"
              fillOpacity={0.4}
              stroke="var(--color-monto)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='bg-transparent border-t-muted-foreground/20'>
        <div className="flex w-full flex-col gap-1 text-sm text-muted-foreground leading-none">
          <span className="font-medium text-foreground">
            Total del día:{" "}
            {totalDia.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </span>
          <span>24 franjas horarias (09:00 - 23:59)</span>
        </div>
      </CardFooter>
    </Card>
  );
}
