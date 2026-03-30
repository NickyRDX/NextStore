import { Suspense } from "react";
import { connection } from "next/server";
import { getProductos } from "@/actions/productos";
import DialogAgregarProducto from "./components/DialogAgregarProducto";
import TablaProductos from "./components/TablaProductos";
import PaginacionProductos from "./components/PaginacionProductos";
import { Spinner } from "@/components/ui/spinner";

async function ProductosContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await connection();
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { productos, total, totalPages } = await getProductos({ page: currentPage });

  return (
    <>
      {/* Header subtitle */}
      <p className="text-sm text-muted-foreground mt-0.5">
        {total === 0
          ? "No hay productos cargados"
          : `${total} producto${total !== 1 ? "s" : ""} en inventario`}
      </p>

      {/* Tabla */}
      <TablaProductos productos={productos} />

      {/* Paginación */}
      <PaginacionProductos currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}

export default function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <section className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Productos</h1>
        <DialogAgregarProducto />
      </div>

      <Suspense fallback={<Spinner className="size-6 text-blue-400" />}>
        <ProductosContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
