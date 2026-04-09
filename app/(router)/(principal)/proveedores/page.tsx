import { Suspense } from "react"
import { connection } from "next/server"
import { getProveedores } from "@/actions/proveedores"
import ProveedorSheet from "./components/ProveedorSheet"
import TablaProveedores from "./components/TablaProveedores"
import { Spinner } from "@/components/ui/spinner"

async function ProveedoresContent() {
  await connection()
  const proveedores = await getProveedores()

  return (
    <>
      <p className="text-sm text-muted-foreground mt-0.5">
        {proveedores.length === 0
          ? "No hay proveedores cargados"
          : `${proveedores.length} proveedor${proveedores.length !== 1 ? "es" : ""} registrado${proveedores.length !== 1 ? "s" : ""}`}
      </p>
      <TablaProveedores proveedores={proveedores} />
    </>
  )
}

export default function ProveedoresPage() {
  return (
    <section className="p-3 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Proveedores</h1>
        <ProveedorSheet />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full w-full max-w-7xl mx-auto">
            <Spinner className="size-6 text-blue-400" />
          </div>
        }
      >
        <ProveedoresContent />
      </Suspense>
    </section>
  )
}
