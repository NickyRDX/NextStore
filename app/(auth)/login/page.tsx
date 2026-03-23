"use client"
import React, {useState} from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {login} from '@/actions/auth'
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginFormSchema, LoginData } from './form.data'
export default function page() {
  const [cargando, setCargando] = useState<boolean>(false)
  const form = useForm<LoginData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  async function onSubmit(data: LoginData){
    setCargando(true)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    await new Promise((r) => {
      const intervalId = setInterval(()=>{
        clearInterval(intervalId)
        r(null)
      }, 3000)
    })
    const result = await login(formData)
    if(result.error){
      toast.error(result.error)
    }else{
      toast.success('Login exitoso')
    }
    setCargando(false)
    form.reset()
  }
  return (
    <Card className="w-full max-w-sm shadow-lg rounded-sm border-slate-900/10 border max-h-full dark:border-slate-200/10 md:max-w-md">
      <CardHeader className="my-2">
        <CardTitle className="text-2xl text-center font-semibold tracking-tight text-slate-700 dark:text-slate-200 cursor-default">
          Iniciar sesión👍🏻
        </CardTitle>
        <CardDescription className="text-accent-foreground my-2 cursor-default text-xs text-center underline decoration-secondary-foreground">
          Bienvenido/a a Drugstore Controls
        </CardDescription>
      </CardHeader>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="px-4 gap-6 space-y-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="tracking-tight text-muted-foreground"
                  htmlFor="form-rhf-demo-email"
                >
                  Correo electrónico
                </FieldLabel>
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  id="form-rhf-demo-email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  type="email"
                  required
                  className="h-12 focus-visible:ring-blue-400/70 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-xl"
                />
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="tracking-tight text-muted-foreground"
                  htmlFor="form-rhf-demo-password"
                >
                  Contraseña
                </FieldLabel>
                <Input
                  placeholder="por favor ingrese su contraseña"
                  {...field}
                  id="form-rhf-demo-password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  type="password"
                  required
                  className="h-12 focus-visible:ring-blue-400/57 focus-visible:border-blue-400 ring-2 ring-blue-300 w-full rounded-xl"
                />
              </Field>
            )}
          />
        </FieldGroup>
        <CardFooter className="border-none my-5 bg-transparent">
          <Button
            variant="secondary"
            type="submit"
            form="form-rhf-demo"
            disabled={cargando}
            className="w-full cursor-pointer h-12 text-base leading-relaxed tracking-tighter"
          >
            {cargando ? <Spinner /> : "Iniciar sesión"}
          </Button>
        </CardFooter>
        <p className="text-center mb-3 text-pretty text-muted-foreground text-xs cursor-default tracking-tight leading-tight">
          cualquier inconveniente comunicate con el dueño
        </p>
      </form>
    </Card>
  );
}
