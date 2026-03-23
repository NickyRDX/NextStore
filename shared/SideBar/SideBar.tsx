"use client";
import React from 'react'
import { SidebarDato } from './Sidebar.data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {logout} from '@/actions/auth'
import { Button } from '@/components/ui/button';
import { IconArrowBarToRight } from "@tabler/icons-react";
import Logo from "@/public/imagen/Logo.svg"
export default function SideBar() {
  const pathname = usePathname();
  function LogoutButton() {
    logout()
  }
  return (
    <Sidebar
      collapsible="icon"
      className="border-r-black/5 dark:border-r-white/5"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src={Logo}
              alt="Logo"
              width={28}
              height={28}
              quality={100}
              className="object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold cursor-default text-slate-700 dark:text-slate-200 tracking-tight text-base">
              Drugstore Controls
            </span>
            <span className="truncate text-xs cursor-default text-muted-foreground font-medium">
              Control Panel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs leading-relaxed tracking-tighter text-muted-foreground cursor-default underline font-medium mb-2">
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarDato.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <SidebarMenuItem key={item.id} className="mb-3">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.nombre}
                      className={cn(
                        "h-11 transition-all duration-200 ease-in-out flex items-center group-data-[collapsible=icon]:justify-center",
                        isActive
                          ? "bg-primary! rounded-md"
                          : "hover:bg-sidebar-accent/50",
                      )}
                    >
                      <Link
                        href={item.link}
                        className="flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon
                          className={cn(
                            "size-5! stroke-2 shrink-0",
                            isActive
                              ? "text-white"
                              : "dark:text-slate-200 text-slate-700",
                          )}
                        />
                        <span
                          className={cn(
                            "text-md leading-tight tracking-tight transition-colors duration-200 ease-in-out group-data-[collapsible=icon]:hidden truncate",
                            isActive
                              ? "text-slate-100! dark:text-slate-200! font-normal text-base"
                              : "text-slate-700 dark:text-slate-200",
                          )}
                        >
                          {item.nombre}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="secondary"
          onClick={LogoutButton}
          className="p-2.5 cursor-pointer leading-relaxed tracking-tight mb-2.5 text-muted-foreground h-10 group-data-[collapsible=icon]:hidden"
        >
          Cerrar sesión
          <IconArrowBarToRight className="size-4 mt-0.5 ml-1" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
