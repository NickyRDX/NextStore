"use client";
import { ModeToggle } from "@/shared/ModeToggle";
import React from "react";
interface LayoutAuthProps {
  children: React.ReactNode;
}
export default function LayoutAuth({ children }: LayoutAuthProps) {
  return (
    <main className="w-full mx-auto relative flex flex-col h-full">
      <nav className="px-4 py-2 flex justify-end">
        <ModeToggle />
      </nav>
      <section className="flex flex-1 w-full justify-center items-center p-4">
        {children}
      </section>
    </main>
  );
}
