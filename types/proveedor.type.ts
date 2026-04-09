export type EstadoVisita = "PENDIENTE" | "COMPLETADA" | "CANCELADA"

export type Proveedor = {
  id: string
  nombre: string
  empresa: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  notas: string | null
  createdAt: Date
  updatedAt: Date
}

export type VisitaProveedor = {
  id: string
  proveedorId: string
  fecha: Date
  notas: string | null
  estado: EstadoVisita
  createdAt: Date
}

export type ProveedorConVisita = Pick<
  Proveedor,
  "id" | "nombre" | "empresa" | "telefono" | "email" | "direccion" | "notas"
> & {
  proximaVisita: Date | null
}
