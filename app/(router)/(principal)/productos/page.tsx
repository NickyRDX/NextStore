"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IconPlusFilled } from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productFormSchema, ProductFormDato } from "./components/product.form";

export default function ProductosPage() {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<ProductFormDato>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      stock: 0,
      precioCompra: 0,
      precioVenta: 0,
    },
  });

  async function onSubmit(data: ProductFormDato) {
    console.log("datos del formulario: ", data);
  }

  return (
    <section className="p-3">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 rounded-sm px-3 py-5 cursor-pointer"
              variant={`default`}
            >
              Agregar Producto
              <IconPlusFilled size={40} />
            </Button>
          </DialogTrigger>
          <DialogContent className="md:min-w-1/3 w-full">
            <DialogHeader>
              <DialogTitle>Agregar Producto</DialogTitle>
              <DialogDescription>Completar los datos</DialogDescription>
            </DialogHeader>
            <form
              id="form-rhf-demo"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 "
            >
              <FieldGroup>
                <Controller
                  name="nombre"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="tracking-tight text-muted-foreground"
                        htmlFor="form-rhf-demo-email"
                      >
                        Nombre del producto
                      </FieldLabel>
                      <Input
                        placeholder="Nombre del producto"
                        {...field}
                        id="form-rhf-demo-email"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        type="text"
                        required
                        className="h-11 focus-visible:ring-blue-400/70 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-sm"
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="categoria"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-categoria">
                        Categoría del producto
                      </FieldLabel>
                      <Input
                        type="text"
                        autoComplete="off"
                        {...field}
                        required
                        aria-invalid={fieldState.invalid}
                        placeholder="Bebidas, Snacks etc."
                        className="h-11 focus-visible:ring-blue-400/70 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-sm"
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="stock"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-stock">
                        Stock del producto
                      </FieldLabel>
                      <Input
                        type="number"
                        required
                        placeholder="0"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="h-11 focus-visible:ring-blue-400/70 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-sm"
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="precioCompra"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-precioCompra">
                        Precio de compra del producto
                      </FieldLabel>
                      <Input
                        type="number"
                        required
                        placeholder="0"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="h-11 focus-visible:ring-blue-400/70 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-sm"
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="precioVenta"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-precioVenta">
                        Precio de venta del producto
                      </FieldLabel>
                      <Input
                        type="number"
                        required
                        placeholder="0"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="h-11 focus-visible:ring-blue-400/70 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-sm"
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button type="submit" className='w-full my-2 font-semibold tracking-tight text-base py-6' form="form-rhf-demo">Agregar Producto</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
