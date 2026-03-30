import { z } from "zod";

export const productFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  categoria: z.string().optional(),
  precioCosto: z.coerce.number().min(0, "No puede ser negativo"),
  precioVenta: z.coerce.number().min(0, "No puede ser negativo"),
  stock: z.coerce.number().int().min(0, "No puede ser negativo"),
  stockMinimo: z.coerce.number().int().min(0),
  descripcion: z.string().optional(),
});

// Lo que el formulario maneja internamente (strings de los inputs HTML)
export type ProductFormInput = {
  nombre: string;
  categoria?: string;
  precioCosto: number | string;
  precioVenta: number | string;
  stock: number | string;
  stockMinimo: number | string;
  descripcion?: string;
};

// Lo que Zod devuelve tras validar y transformar
export type ProductFormDato = z.output<typeof productFormSchema>;
