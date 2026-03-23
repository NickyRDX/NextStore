"use client";
import React from "react";
import CardIngresos from "./components/CardIngresos/CardIngresos";
import Grafica from "./components/Grafica/Grafica";

export default function DashboardPage() {
  return (
    <section className="p-5 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardIngresos/>
        <CardIngresos/>
        <CardIngresos/>
        <CardIngresos/>
      </section>
      <section className='gap-6'>
        <Grafica/>
      </section>
    </section>
  );
}
