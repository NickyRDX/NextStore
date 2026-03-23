"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/shared/ModeToggle";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import SideBar from "@/shared/SideBar/SideBar";
interface LayoutPrincipalProps {
  children: React.ReactNode;
}
export default function LayoutPrincipal({ children }: LayoutPrincipalProps) {
  const pathname = usePathname();
  const segmentos = pathname
    .split("/")
    .filter(Boolean)
    .filter((segmento) => segmento !== "(principal)");
  return (
    <main className={cn("w-full relative min-h-full")}>
      <SidebarProvider>
        <SideBar/>
        <SidebarInset>
          <nav className="w-full h-14 p-5 border-b border-slate-800/20 dark:border-slate-100/30 flex justify-between items-center sticky z-50 top-0 inset-x-0 backdrop-blur-lg overflow-hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="cursor-pointer" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className="cursor-default"
                    >
                      *
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {segmentos.map((segmento, i) => {
                    const href = "/" + segmentos.slice(0, i + 1).join("/");
                    const label = segmento
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                    const isLast = i === segmentos.length - 1;
                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="cursor-default">
                              {label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={href}
                              className="cursor-pointer"
                            >
                              {label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="">
              <ModeToggle />
            </div>
          </nav>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
