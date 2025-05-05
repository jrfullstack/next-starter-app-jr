"use server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { encrypt, prisma } from "@/lib";

const appConfigSchema = z.object({
  emailHost: z.string().min(1),
  emailPort: z.coerce.number().int().min(1).max(65_535),
  emailUser: z.string().email(),
  emailPassEnc: z.string().optional().or(z.literal("")),
  isEmailConfigured: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),
});

export async function updateSmtpConfig(formData: FormData) {
  try {
    // Convertimos FormData a objeto plano
    const rawData: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries());

    // Validar
    const data = appConfigSchema.parse(rawData);

    let updatedEmailPassEnc: string | undefined;

    // Si la contraseña fue modificada, la encriptamos y la guardamos
    if (data.emailPassEnc && data.emailPassEnc.trim()) {
      updatedEmailPassEnc = await encrypt(data.emailPassEnc);
    }

    // Actualizar la configuración
    await prisma.appConfig.update({
      where: { id: 1 },
      data: {
        emailHost: data.emailHost,
        emailPort: data.emailPort,
        emailUser: data.emailUser,
        ...(updatedEmailPassEnc && { emailPassEnc: updatedEmailPassEnc }), // solo si hay cambio
        isEmailConfigured: data.isEmailConfigured,
        updatedAt: new Date(),
      },
    });

    // Revalidar cache
    revalidateTag("app-config");

    return { ok: true };
  } catch (error) {
    console.error("[SMTP_CONFIG_UPDATE_ERROR]", error);
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
