import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUpIcon } from 'lucide-react';
import {getProductosStats} from '@/actions/dashboard'
import { connection } from 'next/server';
import { IconBox } from '@tabler/icons-react';
export default async function CardProductos() {
  await connection()
  const {totalActivos} = await getProductosStats()
  console.log("Total de productos:", totalActivos)
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <CardDescription className="text-pretty tracking-tight text-muted-foreground text-sm">
            Productos Totales
          </CardDescription>
          <div className="size-9 bg-amber-700/20 rounded-md flex items-center justify-center">
            <IconBox size={24} className="text-amber-400" />
          </div>
        </div>
        <CardTitle className="text-slate-700 my-1.5 dark:text-slate-200 leading-relaxed tracking-tight text-3xl md:text-xl font-semibold text-pretty">
          {totalActivos}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-pretty bg-transparent text-sm border-none text-muted-foreground leading-tight tracking-tighter">
        Este recuadro muestra la cantidad total de productos activos registrados
        actualmente en el inventario de tu drugstore. Controlar este número te
        ayuda a tener una visión general de la variedad de productos disponibles
        para la venta.
      </CardFooter>
    </Card>
  );
}
