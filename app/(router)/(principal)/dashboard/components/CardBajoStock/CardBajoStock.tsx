
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
import { Badge } from "@/components/ui/badge";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { connection } from 'next/server';
import { getProductosStats } from '@/actions/dashboard';
import { IconClipboardX } from "@tabler/icons-react";
export default async function CardBajoStock() {
  await connection()
  const {bajoStock} = await getProductosStats()
  console.log("Total de productos con bajo stock:", bajoStock)
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <CardDescription className="text-pretty tracking-tight text-muted-foreground text-xs">
            Productos con bajo stock
          </CardDescription>

          {/* <Badge
            variant={`outline`}
            className="flex gap-1 items-center font-medium"
          >
            <TrendingDownIcon className="size-3 text-red-400" />
          </Badge> */}
          <div className="size-9 bg-red-700/20 rounded-md flex items-center justify-center">
            <IconClipboardX size={24} className="text-red-400" />
          </div>
        </div>
        <CardTitle className="text-slate-700 my-1.5 dark:text-slate-200 leading-relaxed tracking-tight text-3xl md:text-xl font-semibold text-pretty">
          {bajoStock}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-pretty bg-transparent text-sm border-none text-muted-foreground leading-tight tracking-tighter">
        Este recuadro muestra la cantidad total de productos cuyo stock actual
        es igual o inferior al mínimo definido en tu drugstore. Un producto en
        estado de bajo stock indica que está por agotarse o requiere reposición
        inmediata.
      </CardFooter>
    </Card>
  );
}
