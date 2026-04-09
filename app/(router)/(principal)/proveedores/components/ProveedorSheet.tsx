"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  IconPlusFilled,
  IconCalendar,
  IconUser,
  IconPhone,
  IconNotes,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"

import { proveedorFormSchema, type ProveedorFormDato } from "./proveedor.form"
import type { ProveedorConVisita } from "@/types/proveedor.type"

type Props = {
  proveedor?: ProveedorConVisita
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ProveedorSheet({
  proveedor,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const [loading, setLoading] = useState(false)
  const [agendarVisita, setAgendarVisita] = useState(false)
  const router = useRouter()

  const isEditing = !!proveedor

  const form = useForm<ProveedorFormDato>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(proveedorFormSchema) as any,
    defaultValues: {
      nombre: proveedor?.nombre ?? "",
      empresa: proveedor?.empresa ?? "",
      telefono: proveedor?.telefono ?? "",
      email: proveedor?.email ?? "",
      direccion: proveedor?.direccion ?? "",
      notas: proveedor?.notas ?? "",
      notasVisita: "",
    },
  })

  // Reset form with new proveedor data when editing prop changes
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && proveedor) {
      form.reset({
        nombre: proveedor.nombre,
        empresa: proveedor.empresa ?? "",
        telefono: proveedor.telefono ?? "",
        email: proveedor.email ?? "",
        direccion: proveedor.direccion ?? "",
        notas: proveedor.notas ?? "",
        notasVisita: "",
      })
      setAgendarVisita(false)
    }
    if (!nextOpen) {
      form.reset()
      setAgendarVisita(false)
    }
    setOpen(nextOpen)
  }

  async function onSubmit(data: ProveedorFormDato) {
    setLoading(true)
    try {
      const url = isEditing
        ? `/api/proveedores/${proveedor.id}`
        : "/api/proveedores"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fechaVisita: data.fechaVisita?.toISOString() ?? null,
        }),
      })

      if (res.ok) {
        toast.success(
          isEditing ? "Proveedor actualizado" : "Proveedor creado correctamente"
        )
        handleOpenChange(false)
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error ?? "Error inesperado")
      }
    } catch {
      toast.error("Error de conexión. Intentá de nuevo.")
    }
    setLoading(false)
  }

  function toggleVisita() {
    const next = !agendarVisita
    setAgendarVisita(next)
    if (!next) form.setValue("fechaVisita", undefined)
  }

  const fechaSeleccionada = form.watch("fechaVisita")

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {/* Solo muestra el trigger en modo crear */}
      {!isEditing && (
        <SheetTrigger asChild>
          <Button className="gap-1.5 cursor-pointer rounded-sm px-2.5 py-5 font-medium">
            Agregar Proveedor
            <IconPlusFilled size={16} />
          </Button>
        </SheetTrigger>
      )}

      <SheetContent
        side="right"
        className="w-full max-w-xl p-1.5 gap-2 flex flex-col border-muted-foreground/20"
      >
        {/* Header fijo */}
        <SheetHeader className="px-6 py-4 gap-1">
          <SheetTitle className="text-base font-semibold tracking-tight">
            {isEditing ? `Editar: ${proveedor.nombre}` : "Agregar proveedor"}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Modificá los datos y guardá los cambios."
              : "Completá los datos del proveedor y agendá una visita si querés."}
          </SheetDescription>
        </SheetHeader>

        {/* Cuerpo scrollable */}
        <form
          id="form-proveedor"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto divide-y"
        >
          {/* ── Sección 1: Datos básicos ─────────────────────── */}
          <div className="px-6 py-5 space-y-4 border-none">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <IconUser size={20} />
              Datos básicos
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <Controller
                name="nombre"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Nombre <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Ej: Juan García"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-lg"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Empresa */}
              <Controller
                name="empresa"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Empresa
                    </FieldLabel>
                    <Input
                      placeholder="Ej: Distribuidora del Norte"
                      autoComplete="off"
                      className="h-10 rounded-lg"
                      {...field}
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          {/* ── Sección 2: Contacto ───────────────────────────── */}
          <div className="px-6 py-5 space-y-4 border-none">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <IconPhone size={20} />
              Contacto
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Teléfono */}
              <Controller
                name="telefono"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                      Teléfono
                    </FieldLabel>
                    <Input
                      type="tel"
                      placeholder="+54 9 11 1234-5678"
                      autoComplete="off"
                      className="h-10 rounded-lg"
                      {...field}
                    />
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                      Email
                    </FieldLabel>
                    <Input
                      type="email"
                      placeholder="proveedor@ejemplo.com"
                      autoComplete="off"
                      className="h-10 rounded-lg"
                      {...field}
                    />
                  </Field>
                )}
              />
            </div>

            {/* Dirección */}
            <Controller
              name="direccion"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                    Dirección
                  </FieldLabel>
                  <Input
                    placeholder="Ej: Av. Corrientes 1234, CABA"
                    autoComplete="off"
                    className="h-10 rounded-lg"
                    {...field}
                  />
                </Field>
              )}
            />
          </div>

          {/* ── Sección 3: Notas internas ─────────────────────── */}
          <div className="px-6 py-5 border-none space-y-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <IconNotes size={20} />
              Notas internas
            </p>
            <Controller
              name="notas"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <textarea
                    placeholder="Condiciones de pago, productos que ofrece, frecuencia de entregas…"
                    className="h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...field}
                  />
                </Field>
              )}
            />
          </div>

          {/* ── Sección 4: Agendar visita ─────────────────────── */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <IconCalendar size={20} />
                Agendar visita
              </p>
              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={agendarVisita}
                onClick={toggleVisita}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  agendarVisita ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ${
                    agendarVisita ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {agendarVisita && (
              <div className="space-y-4">
                <Controller
                  name="fechaVisita"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                        Seleccioná el día de la visita
                      </FieldLabel>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                          className="rounded-lg border"
                        />
                      </div>
                      {fechaSeleccionada && (
                        <p className="text-center text-xs text-muted-foreground">
                          Visita agendada:{" "}
                          <span className="font-medium text-foreground capitalize">
                            {fechaSeleccionada.toLocaleDateString("es-AR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </p>
                      )}
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="notasVisita"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                        Notas de la visita
                      </FieldLabel>
                      <Input
                        placeholder="Ej: Traer lista de precios actualizada"
                        autoComplete="off"
                        className="h-10 rounded-lg"
                        {...field}
                      />
                    </Field>
                  )}
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer fijo */}
        <SheetFooter className="mt-0 border-none px-6 py-4">
          <Button
            type="submit"
            form="form-proveedor"
            disabled={loading}
            className="w-full h-10 rounded-xs font-semibold cursor-pointer"
          >
            {loading ? (
              <Spinner />
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Agregar Proveedor"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
