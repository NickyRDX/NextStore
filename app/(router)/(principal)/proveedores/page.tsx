"use client"
import { Button } from '@/components/ui/button';
import { IconPlusFilled } from '@tabler/icons-react';
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function ProveedoresPage() {
  return (
    <section className="p-3">
      <div className="flex justify-end">
        <Button className="gap-2 rounded-sm px-3 py-5" variant={`default`}>
          Agregar Proveedor
          <IconPlusFilled size={40} />
        </Button>
      </div>
    </section>
  );
}
