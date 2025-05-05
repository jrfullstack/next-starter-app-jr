"use client";
import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";

import { Menu } from "@/components/admin/panel/menu";
import { SidebarToggle } from "@/components/admin/panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar, useStore } from "@/hooks";
import { cn } from "@/lib";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        getOpenState() ? "w-72" : "w-[90px]",
        settings.disabled && "hidden",
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800"
      >
        <Button
          className={cn(
            "mb-1 transition-transform duration-300 ease-in-out",
            getOpenState() ? "translate-x-0" : "translate-x-1",
          )}
          variant="link"
          asChild
        >
          <Link href="/admin" className="flex items-center gap-2">
            <PanelsTopLeft className="mr-1 h-6 w-6" />
            <h1
              className={cn(
                "text-lg font-bold whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-in-out",
                getOpenState() ? "translate-x-0 opacity-100" : "hidden -translate-x-96 opacity-0",
              )}
            >
              Brand
            </h1>
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
