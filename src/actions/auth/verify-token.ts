"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";

const codeSchema = z.object({
  code: z.string().min(6, "El código es inválido"),
});

export const verifyToken = async (code: string) => {
  try {
    const { code: validatedCode } = codeSchema.parse({ code });
    // buscamos si hay una verificación con este código,
    // aquí faltaría ponerle por el usuario también
    const tokenEntry = await prisma.userVerificationToken.findUnique({
      where: { verificationToken: validatedCode },
    });

    // si no existe esa verificación en espera o si el token ya expiro
    if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
      return { ok: false, error: "El código es inválido o ha expirado." };
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenEntry.userId },
    });

    if (user?.emailVerified) {
      // Ya estaba verificado
      await prisma.userVerificationToken.delete({
        where: { verificationToken: validatedCode },
      });

      return { ok: false, error: "Esta cuenta ya fue verificada." };
    }

    // Marcar usuario como verificado
    const updatedUser = await prisma.user.update({
      where: { id: tokenEntry.userId },
      data: { emailVerified: new Date() },
    });

    // Eliminar el token usado
    await prisma.userVerificationToken.delete({
      where: { verificationToken: validatedCode },
    });

    return { ok: true, userEmailVerify: updatedUser.emailVerified };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors[0]?.message || "Código inválido" };
    }
    console.error(error);
    return {
      ok: false,
      error: "Error interno al verificar el token.",
    };
  }
};
