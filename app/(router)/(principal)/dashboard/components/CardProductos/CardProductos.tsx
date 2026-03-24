
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUpIcon } from 'lucide-react';
import React from 'react'
import {getProductosStats} from '@/actions/dashboard'
import { connection } from 'next/server';
export default async function CardProductos() {
  await connection()
  const {totalActivos} = await getProductosStats()
  console.log("Total de productos:", totalActivos)
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <CardDescription className="text-pretty tracking-tight text-muted-foreground text-xs">
            Productos Totales
          </CardDescription>

          <Badge
            variant={`outline`}
            className="flex gap-1 items-center font-medium"
          >
            <TrendingUpIcon className="size-3 text-green-400" />
          </Badge>
        </div>
        <CardTitle className="text-slate-700 my-1.5 dark:text-slate-200 leading-relaxed tracking-tight text-3xl md:text-xl font-semibold text-pretty">
          {totalActivos}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-pretty bg-transparent text-sm border-none text-muted-foreground leading-tight tracking-tighter">
        Aqui esta el total de productos que tienes en tu drugstore
      </CardFooter>
    </Card>
  );
}
