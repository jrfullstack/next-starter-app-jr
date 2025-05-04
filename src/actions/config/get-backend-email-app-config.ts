"use server";

import prisma from "@/lib/prisma";

// Define el tipo explícito para la configuración de email
export interface BackendEmailAppConfig {
  emailHost: string | null;
  emailPort: number | null;
  emailUser: string | null;
  emailPassEnc: string | null;
}

export async function getBackendEmailAppConfig(): Promise<BackendEmailAppConfig | null> {
  try {
    const config = await prisma.appConfig.findUnique({
      where: { id: 1 },
      select: {
        emailHost: true,
        emailPort: true,
        emailUser: true,
        emailPassEnc: true,
      },
    });

    if (!config) {
      // Si no hay configuración, puedes retornar null o valores por defecto
      console.error("No hay configuración de email");
      return null;
    }

    return config;
  } catch (error) {
    console.error("Error loading backend email AppConfig:", error);
    return null;
  }
}
