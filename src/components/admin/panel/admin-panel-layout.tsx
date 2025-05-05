"use client";

import { Footer, Sidebar } from "@/components";
import { useSidebar, useStore } from "@/hooks";
import { cn } from "@/lib";

export default function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "bg-background dark:bg-background min-h-[calc(100vh_-_56px)] transition-[margin-left] duration-300 ease-in-out",
          !settings.disabled && (getOpenState() ? "lg:ml-72" : "lg:ml-[90px]"),
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          !settings.disabled && (getOpenState() ? "lg:ml-72" : "lg:ml-[90px]"),
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
