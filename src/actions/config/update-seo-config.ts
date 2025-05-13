"use server";

import { revalidateTag } from "next/cache";
import path from "path";
import { z } from "zod";

import { deleteFileIfExists } from "@/actions/config/delete-file-if-exists";
import { saveFile } from "@/actions/config/save-file";
import { prisma } from "@/lib";

const appConfigSchema = z.object({
  siteDisplayName: z.string().min(1),
  siteUrl: z.string().url(),
  siteDescription: z.string().optional(),
  defaultLocale: z.string().optional(),
  faviconUrl: z.string().optional(),
  isSiteNoIndexEnabled: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),
  seoDefaultKeywords: z.string().optional().or(z.literal("")),
});

export async function updateSeoConfig(formData: FormData) {
  try {
    // Convertimos FormData a objeto plano
    const rawData: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries());

    // Validar
    const data = appConfigSchema.parse(rawData);

    // Obtener configuración actual para borrar el logo anterior si es necesario
    const currentConfig = await prisma.appConfig.findUnique({ where: { id: 1 } });

    // Obtener el archivo (logo)
    const file = formData.get("favicon");
    let faviconUrl: string | undefined;

    if (file instanceof File && file.size > 0) {
      // Validar tamaño máximo (2MB)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("El archivo excede el tamaño máximo permitido de 2MB");
      }

      // Configuración de directorios
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      const { url: newFaviconUrl } = await saveFile(file, uploadsDir, "favicon");
      faviconUrl = newFaviconUrl;

      // Borrar el logo anterior si existe
      if (currentConfig?.faviconUrl) {
        await deleteFileIfExists(currentConfig?.faviconUrl);
      }
    } else if (
      formData.get("faviconUrl") === "null" && // Caso cuando se quiere eliminar el logo
      currentConfig?.faviconUrl
    ) {
      await deleteFileIfExists(currentConfig?.faviconUrl);
      faviconUrl = undefined;
    }

    // Actualizar base de datos
    await prisma.appConfig.update({
      where: { id: 1 },
      data: {
        siteDisplayName: data.siteDisplayName,
        siteUrl: data.siteUrl,
        siteDescription: data.siteDescription,
        ...(faviconUrl !== undefined && { faviconUrl }), // Actualiza solo si hay cambio
        defaultLocale: data.defaultLocale,
        isSiteNoIndexEnabled: data.isSiteNoIndexEnabled,
        seoDefaultKeywords: data.seoDefaultKeywords,
        updatedAt: new Date(),
      },
    });

    // Revalidar cache
    revalidateTag("app-config");

    return { ok: true };
  } catch (error) {
    console.error("[SEO_CONFIG_UPDATE_ERROR]", error);
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
