import {NextResponse} from "next/server"
//Aqui importarias tu cliente de DB real (Prisma, etc)
//import {db} from '@/lib/db'
import {prisma} from '@/lib/prisma'

//creamos y exportamos una funcion asincrona para traer los productos
export async function GET(){
  try {
    const prod = await prisma.producto.findMany({
      orderBy: {nombre: 'asc'},
      select: {
        id: true,
        nombre: true,
        precioVenta: true,
        categoria: {
          select: {
            nombre: true,
          }
        }
      }
    })
    return NextResponse.json(prod)
  }catch(e){
    return NextResponse.json({
      error: 'Error al cargar los productos',
    },{
      status: 500
    })
  }
}