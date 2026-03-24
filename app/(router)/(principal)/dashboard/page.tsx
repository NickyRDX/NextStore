import React, { Suspense } from "react";
import CardIngresos from "./components/CardIngresos/CardIngresos";
import Grafica from "./components/Grafica/Grafica";
import CardProductos from "./components/CardProductos/CardProductos";
import CardGanancias from "./components/CardGanancias/CardGanancias";
import CardBajoStock from "./components/CardBajoStock/CardBajoStock";
import { SkeletonCard } from "@/shared/SkeletonCard";

export default function DashboardPage() {
  return (
    <section className="p-5 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Suspense fallback={<SkeletonCard />}>
          <CardIngresos />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <CardProductos />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <CardGanancias />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <CardBajoStock />
        </Suspense>
      </section>
      <section className="gap-6">
        <Grafica />
      </section>
    </section>
  );
}
