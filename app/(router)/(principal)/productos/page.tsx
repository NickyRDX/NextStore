"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { IconPlusFilled } from "@tabler/icons-react";
export default function ProductosPage() {
  return (
    <section className='p-5'>
      <div className='flex justify-end'>
        <Button className='gap-2 rounded-sm px-3 py-5 cursor-pointer' variant={`default`}>Agregar Producto
          <IconPlusFilled size={40}/>
        </Button>
      </div>
    </section>
  )
}
