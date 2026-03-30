import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
};

type Props = {
  productos: Producto[];
};

function formatPrecio(n: number) {
  return `$\u00A0${Math.round(n).toLocaleString("es-AR")}`;
}

function MargenBadge({ costo, venta }: { costo: number; venta: number }) {
  if (costo === 0) return <span className="text-muted-foreground text-xs">—</span>;
  const margen = ((venta - costo) / costo) * 100;
  const color =
    margen >= 30
      ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      : margen >= 15
      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${color}`}>
      {margen.toFixed(1)}%
    </span>
  );
}

function StockBadge({ stock, stockMinimo }: { stock: number; stockMinimo: number }) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="text-xs font-medium">
        Sin stock
      </Badge>
    );
  }
  if (stock <= stockMinimo) {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/10 text-xs font-medium">
        Bajo · {stock}
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/10 text-xs font-medium">
      {stock} en stock
    </Badge>
  );
}

export default function TablaProductos({ productos }: Props) {
  if (productos.length === 0) {
    console.log(productos.length)
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <p className="text-base font-medium text-foreground">No hay productos todavía</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Agregá el primero usando el botón de arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="">
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-none">
            <TableHead className="pl-4 font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Categoría</TableHead>
            <TableHead className="font-semibold text-right">Costo</TableHead>
            <TableHead className="font-semibold text-right">Venta</TableHead>
            <TableHead className="font-semibold text-center">Margen</TableHead>
            <TableHead className="font-semibold text-center pr-4">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((p) => (
            <TableRow className='border-slate-200 dark:border-slate-800' key={p.id}>
              <TableCell className="pl-4">
                <span className="font-medium">{p.nombre}</span>
                {p.descripcion && (
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] truncate">
                    {p.descripcion}
                  </p>
                )}
              </TableCell>
              <TableCell>
                {p.categoria ? (
                  <span className="text-sm">{p.categoria}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                AR{formatPrecio(p.precioCosto)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                AR{formatPrecio(p.precioVenta)}
              </TableCell>
              <TableCell className="text-center">
                <MargenBadge costo={p.precioCosto} venta={p.precioVenta} />
              </TableCell>
              <TableCell className="text-center pr-4">
                <StockBadge stock={p.stock} stockMinimo={p.stockMinimo} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
