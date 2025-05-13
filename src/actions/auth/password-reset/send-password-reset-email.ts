"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";

import type { SendEmailResponse } from "@/actions/auth/send-email";
import { sendEmail } from "@/actions/auth/send-email";
import { TokenType } from "@/app/generated/prisma";
import { getPasswordResetEmail } from "@/emails";
import { prisma } from "@/lib";

// Validación con Zod
const EmailSchema = z.object({
  emailTo: z.string().email("Email inválido"),
});

export const sendPasswordResetEmail = async (
  props: z.infer<typeof EmailSchema>,
): Promise<SendEmailResponse> => {
  try {
    // Validar con Zod
    const { emailTo } = EmailSchema.parse(props);

    const user = await prisma.user.findUnique({
      where: { email: emailTo },
    });

    // Mensaje genérico aunque el usuario no exista
    if (!user) {
      return {
        ok: true,
        message: "Si el correo existe, te enviaremos instrucciones para restablecer tu contraseña.",
      };
    }

    const now = new Date();

    // Limpieza de tokens expirados
    await prisma.userVerificationToken.deleteMany({
      where: {
        tokenType: TokenType.PASSWORD_RESET,
        expiresAt: { lt: now },
      },
    });

    // Verificar si ya hay uno activo
    const existingToken = await prisma.userVerificationToken.findFirst({
      where: {
        userId: user.id,
        tokenType: TokenType.PASSWORD_RESET,
        expiresAt: { gt: now },
      },
    });

    if (existingToken) {
      return {
        ok: false,
        message: "Ya se ha enviado un correo recientemente. Intenta en unos minutos.",
      };
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    // Guardar token (crear o reemplazar)
    await prisma.userVerificationToken.upsert({
      where: {
        userId_tokenType: {
          userId: user.id,
          tokenType: TokenType.PASSWORD_RESET,
        },
      },
      create: {
        userId: user.id,
        verificationToken: token,
        expiresAt,
        tokenType: TokenType.PASSWORD_RESET,
      },
      update: {
        verificationToken: token,
        expiresAt,
      },
    });

    // Enviar correo
    const { subject, text, html } = getPasswordResetEmail({ url: resetUrl });
    return await sendEmail({
      to: emailTo,
      subject,
      text,
      html,
    });
  } catch (error) {
    // Manejo de error de validación
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        message: error.errors[0]?.message || "Email inválido",
      };
    }

    console.error("Error en sendPasswordResetEmail:", error);
    return {
      ok: false,
      message: "Ocurrió un error al procesar la solicitud.",
    };
  }
};
