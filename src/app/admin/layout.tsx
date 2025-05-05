import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminPanelLayout from "@/components/admin/panel/admin-panel-layout";

export const metadata: Metadata = {
  title: "Configuración | Panel de Administración",
  description: "Administra la configuración global de la plataforma",
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
