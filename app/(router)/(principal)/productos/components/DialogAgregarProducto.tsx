"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconPlusFilled } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { productFormSchema, ProductFormInput, ProductFormDato } from "./product.form";
import { crearProducto } from "@/actions/productos";

export default function DialogAgregarProducto() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormInput, unknown, ProductFormDato>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      nombre: "",
      categoria: "",
      precioCosto: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 5,
      descripcion: "",
    },
  });

  const precioCosto = Number(form.watch("precioCosto")) || 0;
  const precioVenta = Number(form.watch("precioVenta")) || 0;
  const margen =
    precioCosto > 0
      ? (((precioVenta - precioCosto) / precioCosto) * 100).toFixed(1)
      : null;
  const margenPositivo = margen !== null && Number(margen) >= 0;

  async function onSubmit(data: ProductFormDato) {
    setLoading(true);
    const result = await crearProducto(data);
    setLoading(false);

    if (result.success) {
      toast.success("Producto creado correctamente");
      form.reset();
      setOpen(false);
    } else {
      toast.error(result.error ?? "Error al crear el producto");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 cursor-pointer rounded-sm px-2.5 py-5 font-medium">
          <IconPlusFilled size={16} />
          Agregar Producto
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg rounded-sm p-0 overflow-hidden">
        {/* Header con fondo sutil */}
        <div className="border-none px-5 py-3">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Agregar producto
            </DialogTitle>
            <DialogDescription className="text-sm text-pretty text-muted-foreground mt-0.5">
              Completá los datos para agregar un nuevo producto al inventario.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          id="form-agregar-producto"
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 py-3 flex flex-col gap-5 max-h-[70vh] overflow-y-auto"
        >
          {/* Nombre */}
          <Controller
            name="nombre"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-medium text-pretty text-slate-800 dark:text-slate-200">
                  Nombre del producto{" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Ej: Coca Cola 500ml"
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

          {/* Categoría */}
          <Controller
            name="categoria"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-sm font-medium text-pretty text-slate-800 dark:text-slate-200">
                  Categoría
                </FieldLabel>
                <Input
                  placeholder="Ej: Bebidas, Snacks, Lácteos…"
                  autoComplete="off"
                  className="h-10 rounded-lg"
                  {...field}
                />
                <p className="text-xs tracking-tight text-muted-foreground mt-1">
                  Si no existe, se crea automáticamente.
                </p>
              </Field>
            )}
          />

          {/* Precios */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-pretty text-slate-800 dark:text-slate-200">
              Precios
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="precioCosto"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                      Compra <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step={0.01}
                        placeholder=""
                        aria-invalid={fieldState.invalid}
                        className="h-10 rounded-lg pl-7"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : parseFloat(val),
                          );
                        }}
                      />
                    </div>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="precioVenta"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                      Venta <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step={0.01}
                        aria-invalid={fieldState.invalid}
                        className="h-10 rounded-lg pl-7"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : parseFloat(val),
                          );
                        }}
                      />
                    </div>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Indicador de margen */}
            {margen !== null && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  margenPositivo
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    margenPositivo ? "bg-green-500" : "bg-destructive"
                  }`}
                />
                Margen de ganancia: {margen}%
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-pretty text-slate-800 dark:text-slate-200">
              Stock
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                      Actual <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-lg"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : parseInt(val));
                      }}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="stockMinimo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs tracking-tight text-muted-foreground">
                      Mínimo (alerta)
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="5"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-lg"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : parseInt(val));
                      }}
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          {/* Descripción */}
        </form>

        {/* Footer con el botón */}
        <div className="border-none px-6 py-4">
          <Button
            type="submit"
            form="form-agregar-producto"
            disabled={loading}
            className="w-full h-10 rounded-sm leading-relaxed tracking-tight font-semibold cursor-pointer"
          >
            {loading ? "Guardando…" : "Agregar Producto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
