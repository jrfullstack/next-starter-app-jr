import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Configuración | Panel de Administración",
  description: "Administra la configuración global de la plataforma",
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <main className="flex-1">{children}</main>
    </div>
  );
}
