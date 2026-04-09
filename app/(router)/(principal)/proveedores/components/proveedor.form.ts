import { z } from "zod"

export const proveedorFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
  direccion: z.string().optional(),
  notas: z.string().optional(),
  fechaVisita: z.date().optional(),
  notasVisita: z.string().optional(),
})

export type ProveedorFormDato = z.output<typeof proveedorFormSchema>
