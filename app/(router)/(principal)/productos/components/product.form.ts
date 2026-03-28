import { z } from "zod";

export const productFormSchema = z.object(
  {
    nombre: z.string().min(3, "El nombre debe tener al menos 2 caracteres"),
    categoria: z.string().min(5, "La categoría es requerida"),
    stock: z.number().min(0).max(100000),
    precioCompra: z.number().min(0).max(100000),
    precioVenta: z.number().min(0).max(100000),
  }
)

export type ProductFormDato = z.infer<typeof productFormSchema>