"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";

import { sendEmailVerification } from "./send-email-verification";

const emailSchema = z.object({
  email: z.string().email("Correo inválido"),
});

export const resendVerificationEmail = async (email: string) => {
  try {
    const { email: validatedEmail } = emailSchema.parse({ email });

    const user = await prisma.user.findUnique({
      where: { email: validatedEmail },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      return { ok: false, error: "Este correo no está registrado." };
    }

    if (user.emailVerified) {
      return { ok: false, error: "Este correo ya ha sido verificado." };
    }

    const result = await sendEmailVerification({
      userId: user.id,
      emailTo: validatedEmail,
    });

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors[0]?.message || "Correo inválido" };
    }
    console.error("Error en resendVerificationEmail:", error);
    return { ok: false, error: "Error interno al reenviar el correo de verificación." };
  }
};
