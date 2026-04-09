"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import ProveedorSheet from "./ProveedorSheet"
import type { ProveedorConVisita } from "@/types/proveedor.type"

type Props = {
  proveedores: ProveedorConVisita[]
}

function VisitaBadge({ fecha }: { fecha: ProveedorConVisita["proximaVisita"] }) {
  if (!fecha) return <span className="text-muted-foreground text-xs">—</span>

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const visita = new Date(fecha)
  visita.setHours(0, 0, 0, 0)
  const diffDias = Math.round(
    (visita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  )

  const label = visita.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  })

  if (diffDias < 0)
    return (
      <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 hover:bg-red-500/10 text-xs">
        {label}
      </Badge>
    )
  if (diffDias === 0)
    return (
      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 text-xs">
        Hoy
      </Badge>
    )
  if (diffDias <= 3)
    return (
      <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/10 text-xs">
        {label}
      </Badge>
    )
  return (
    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/10 text-xs">
      {label}
    </Badge>
  )
}

export default function TablaProveedores({ proveedores }: Props) {
  const [editingProveedor, setEditingProveedor] =
    useState<ProveedorConVisita | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProveedorConVisita | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/proveedores/${deleteTarget.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success(`${deleteTarget.nombre} eliminado`)
        setDeleteTarget(null)
        router.refresh()
      } else {
        toast.error("Error al eliminar el proveedor")
      }
    } catch {
      toast.error("Error de conexión")
    }
    setIsDeleting(false)
  }

  if (proveedores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <p className="text-base font-medium text-foreground">
          No hay proveedores todavía
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Agregá el primero usando el botón de arriba.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Sheet de edición — se monta solo cuando hay un proveedor seleccionado */}
      {editingProveedor && (
        <ProveedorSheet
          proveedor={editingProveedor}
          open={!!editingProveedor}
          onOpenChange={(open) => !open && setEditingProveedor(null)}
        />
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar proveedor?</DialogTitle>
            <DialogDescription>
              Vas a eliminar a{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1 cursor-pointer"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabla */}
      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-none">
              <TableHead className="pl-4 font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                Nombre
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                Empresa
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                Contacto
              </TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                Dirección
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-200 tracking-tight text-center">
                Próxima visita
              </TableHead>
              <TableHead className="pr-4 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {proveedores.map((p) => (
              <TableRow
                key={p.id}
                className="border-slate-200 dark:border-slate-800"
              >
                <TableCell className="pl-4">
                  <span className="font-medium tracking-tight">{p.nombre}</span>
                </TableCell>
                <TableCell>
                  {p.empresa ? (
                    <span className="text-sm tracking-tight">{p.empresa}</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    {p.telefono && (
                      <span className="text-sm tracking-tight">
                        {p.telefono}
                      </span>
                    )}
                    {p.email && (
                      <span className="text-xs text-muted-foreground">
                        {p.email}
                      </span>
                    )}
                    {!p.telefono && !p.email && (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {p.direccion ? (
                    <span className="text-sm tracking-tight max-w-[160px] truncate block">
                      {p.direccion}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <VisitaBadge fecha={p.proximaVisita} />
                </TableCell>
                <TableCell className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 cursor-pointer"
                      >
                        <IconDotsVertical size={15} />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-36">
                      <DropdownMenuItem
                        onClick={() => setEditingProveedor(p)}
                        className="cursor-pointer"
                      >
                        <IconPencil size={14} />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(p)}
                        className="cursor-pointer"
                      >
                        <IconTrash size={14} />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
