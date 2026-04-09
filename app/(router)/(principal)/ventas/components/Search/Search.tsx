import { Input } from "@/components/ui/input";
import React from "react";
interface SearchProps {
  valor: string;
  onChange: (valor: string) => void;
  resultados: number;
}
export default function Search({ valor, onChange, resultados }: SearchProps) {
  return (
    <>
      <section className="relative w-full max-w-xl mx-auto">
        <Input
          type="text"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md ring-blue-400 leading-relaxed tracking-tight text-base md:text-sm ring p-5 focus-visible:ring-blue-500/50"
          placeholder="Buscar Producto"
          autoFocus
        />
        {
          valor && (
            <span className='absolute top-3 right-3 text-gray-500 text-sm'>
              {resultados} resultado{resultados !== 1}
            </span>
          )
        }
      </section>
    </>
  );
}
