"use server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib";

const appConfigSchema = z.object({
  isUserSignUpEnabled: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),
  isSingleUserPerIpEnforced: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),

  isEmailVerificationRequired: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),
  isGlobalTwoFactorAuthEnabled: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true),

  maxActiveSessionsPerUser: z
    .union([z.string(), z.number()])
    .transform(Number)
    .pipe(z.number().int().min(1).max(10)),
  sessionTimeoutLimitMinutes: z
    .union([z.string(), z.number()])
    .transform(Number)
    .pipe(z.number().int().min(5).max(10_080)),
});

export async function updateUserConfig(formData: FormData) {
  try {
    // Convertimos FormData a objeto plano
    const rawData: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries());

    // Validar
    const data = appConfigSchema.parse(rawData);

    // Actualizar la configuración
    await prisma.appConfig.update({
      where: { id: 1 },
      data: {
        isUserSignUpEnabled: data.isUserSignUpEnabled,
        maxActiveSessionsPerUser: data.maxActiveSessionsPerUser,
        isSingleUserPerIpEnforced: data.isSingleUserPerIpEnforced,
        isEmailVerificationRequired: data.isEmailVerificationRequired,
        isGlobalTwoFactorAuthEnabled: data.isGlobalTwoFactorAuthEnabled,
        sessionTimeoutLimitMinutes: data.sessionTimeoutLimitMinutes,
        updatedAt: new Date(),
      },
    });

    // Revalidar cache
    revalidateTag("app-config");

    return { ok: true };
  } catch (error) {
    console.error("[USER_CONFIG_UPDATE_ERROR]", error);
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
