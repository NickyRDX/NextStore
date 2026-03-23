"use client"
import { Button } from '@/components/ui/button';
import { IconPlusFilled } from '@tabler/icons-react';
import React from 'react'

export default function EmpleadosPage() {
  return (
    <section className="p-5">
      <div className="flex justify-end">
        <Button className="gap-2 rounded-sm px-3 py-5" variant={`default`}>
          Agregar Empleado
          <IconPlusFilled size={40} />
        </Button>
      </div>
    </section>
  );
}
