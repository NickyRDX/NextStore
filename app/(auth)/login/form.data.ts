import {z} from 'zod'
export const loginFormSchema = z.object({
  email: z.email({message: 'Email invalido'}),
  password: z.string('contraseña requerida').min(2, {message: 'Password debe tener al menos 8 caracteres'}),
})
export type LoginData = z.infer<typeof loginFormSchema>