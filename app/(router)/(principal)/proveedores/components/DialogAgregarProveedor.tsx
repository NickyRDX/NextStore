"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconPlusFilled, IconCalendar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"

import { proveedorFormSchema, type ProveedorFormDato } from "./proveedor.form"
import { crearProveedor } from "@/actions/proveedores"

export default function DialogAgregarProveedor() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agendarVisita, setAgendarVisita] = useState(false)

  const form = useForm<ProveedorFormDato>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(proveedorFormSchema) as any,
    defaultValues: {
      nombre: "",
      empresa: "",
      telefono: "",
      email: "",
      direccion: "",
      notas: "",
      notasVisita: "",
    },
  })

  async function onSubmit(data: ProveedorFormDato) {
    setLoading(true)
    const result = await crearProveedor(data)
    setLoading(false)

    if (result.success) {
      toast.success("Proveedor creado correctamente")
      form.reset()
      setAgendarVisita(false)
      setOpen(false)
    } else {
      toast.error(result.error ?? "Error al crear el proveedor")
    }
  }

  function toggleVisita() {
    const next = !agendarVisita
    setAgendarVisita(next)
    if (!next) form.setValue("fechaVisita", undefined)
  }

  const fechaSeleccionada = form.watch("fechaVisita")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 cursor-pointer rounded-sm px-2.5 py-5 font-medium">
          <IconPlusFilled size={16} />
          Agregar Proveedor
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg rounded-sm p-0 overflow-hidden">
        <div className="px-5 py-3">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Agregar proveedor
            </DialogTitle>
            <DialogDescription className="text-sm text-pretty text-muted-foreground mt-0.5">
              Completá los datos del proveedor y agendá una visita si querés.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          id="form-agregar-proveedor"
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 py-3 flex flex-col gap-5 max-h-[70vh] overflow-y-auto"
        >
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

          {/* Teléfono y Email */}
          <div className="grid grid-cols-2 gap-3">
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
                <FieldLabel className="text-sm font-medium text-slate-800 dark:text-slate-200">
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

          {/* Notas del proveedor */}
          <Controller
            name="notas"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Notas
                </FieldLabel>
                <textarea
                  placeholder="Condiciones de pago, productos que ofrece, etc."
                  className="h-20 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...field}
                />
              </Field>
            )}
          />

          {/* Sección agendar visita */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                <IconCalendar size={16} className="text-muted-foreground" />
                Agendar visita
              </p>
              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={agendarVisita}
                onClick={toggleVisita}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  agendarVisita ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    agendarVisita ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {agendarVisita && (
              <div className="space-y-4 rounded-lg border border-dashed border-muted-foreground/30 p-3">
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

                {/* Notas de la visita */}
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

        {/* Footer */}
        <div className="px-6 py-4">
          <Button
            type="submit"
            form="form-agregar-proveedor"
            disabled={loading}
            className="w-full h-10 rounded-sm font-semibold tracking-tight cursor-pointer"
          >
            {loading ? <Spinner /> : "Agregar Proveedor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
