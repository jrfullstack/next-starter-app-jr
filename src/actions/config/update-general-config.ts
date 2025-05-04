"use server";

import { revalidateTag } from "next/cache";
import path from "path";
import { z } from "zod";

import { prisma } from "@/lib";

import { deleteFileIfExists } from "./delete-file-if-exists";
import { saveFile } from "./save-file";

const appConfigSchema = z.object({
  siteDisplayName: z.string().min(1),
  siteUrl: z.string().url(),
  logoUrl: z.string().url().optional(),
  googleAnalyticsTrackingId: z.string().optional().or(z.literal("")),
  isMaintenanceMode: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),
});

export async function updateGeneralConfig(formData: FormData) {
  try {
    // Convertimos FormData a objeto plano
    const rawData: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries());

    // Validar
    const data = appConfigSchema.parse(rawData);

    // Obtener configuración actual para borrar el logo anterior si es necesario
    const currentConfig = await prisma.appConfig.findUnique({ where: { id: 1 } });

    // Obtener el archivo (logo)
    const file = formData.get("logo");
    let logoUrl: string | undefined;

    if (file instanceof File && file.size > 0) {
      // Validar tamaño máximo (2MB)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("El archivo excede el tamaño máximo permitido de 2MB");
      }

      // Configuración de directorios
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      const { url: newLogoUrl } = await saveFile(file, uploadsDir, "logo");
      logoUrl = newLogoUrl;

      // Borrar el logo anterior si existe
      if (currentConfig?.logoUrl) {
        await deleteFileIfExists(currentConfig?.logoUrl);
      }
    } else if (
      formData.get("logoUrl") === "null" && // Caso cuando se quiere eliminar el logo
      currentConfig?.logoUrl
    ) {
      await deleteFileIfExists(currentConfig?.logoUrl);
      logoUrl = undefined;
    }

    // Actualizar base de datos
    await prisma.appConfig.update({
      where: { id: 1 },
      data: {
        siteDisplayName: data.siteDisplayName,
        siteUrl: data.siteUrl,
        ...(logoUrl !== undefined && { logoUrl }), // Actualiza solo si hay cambio
        isMaintenanceMode: data.isMaintenanceMode,
        googleAnalyticsTrackingId: data.googleAnalyticsTrackingId || null, // Guarda como null si está vacío
        updatedAt: new Date(),
      },
    });

    // Revalidar cache
    revalidateTag("app-config");

    return { ok: true };
  } catch (error) {
    console.error("[GENERAL_CONFIG_UPDATE_ERROR]", error);
    let errorMessage = "Error al actualizar configuración SEO";
    if (error instanceof z.ZodError) {
      errorMessage =
        "Datos de formulario inválidos: " +
        error.errors.map((e) => `${e.path}: ${e.message}`).join(", ");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      ok: false,
      error: errorMessage,
    };
  }
}
