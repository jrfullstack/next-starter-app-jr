"use server";

import { z } from "zod";

import { createVerificationCode } from "@/actions/auth/email-verify/create-verification-code";
import type { SendEmailResponse } from "@/actions/auth/send-email";
import { sendEmail } from "@/actions/auth/send-email";
import { TokenType } from "@/app/generated/prisma";
import { getVerificationEmail } from "@/emails";
import prisma from "@/lib/prisma";

interface Props {
  userId: string;
  emailTo: string;
}

export const sendEmailVerification = async ({
  userId,
  emailTo,
}: Props): Promise<SendEmailResponse> => {
  try {
    const now = new Date();

    // Verifica cuántos tokens activos existen
    const existingTokens = await prisma.userVerificationToken.findMany({
      where: {
        userId,
        tokenType: TokenType.EMAIL_VERIFICATION,
        expiresAt: { gt: now },
      },
    });

    if (existingTokens.length >= 3) {
      return {
        ok: false,
        error:
          "Has alcanzado el límite de 3 intentos de verificación. Por favor, revise su correo o intente más tarde.",
      };
    }

    // esto puede venir del app config
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Eliminar tokens anteriores
    await prisma.userVerificationToken.deleteMany({
      where: {
        userId,
        tokenType: TokenType.EMAIL_VERIFICATION,
      },
    });

    // Generar y guardar token, con retry si colisiona
    const { verificationToken } = await createVerificationCode({ userId, MAX_ATTEMPTS: 5 });

    if (!verificationToken) {
      return {
        ok: false,
        error: "Error al crear el token de verificación",
      };
    }

    const url = `${baseUrl}/auth/verify?token=${verificationToken}`;
    const { html, text, subject } = getVerificationEmail({ verificationToken, url });
    return await sendEmail({
      to: emailTo,
      subject,
      text,
      html,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors[0]?.message || "Datos inválidos" };
    }
    console.error("Error enviando correo de verificación:", error);
    return { ok: false, error: "Error al enviar el correo de verificación." };
  }
};
