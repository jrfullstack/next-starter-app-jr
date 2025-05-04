"use server";

import { z } from "zod";

import { TokenType } from "@/app/generated/prisma";
import { PrismaClientKnownRequestError } from "@/app/generated/prisma/runtime/library";
import { getVerificationEmail } from "@/emails";
import { generateVerificationCode } from "@/lib";
import prisma from "@/lib/prisma";

import type { SendEmailResponse } from "../send-email";
import { sendEmail } from "../send-email";

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

    // Verifica si ya existe un token activo (no expirado)
    const existingToken = await prisma.userVerificationToken.findFirst({
      where: {
        userId,
        tokenType: TokenType.EMAIL_VERIFICATION,
        expiresAt: { gt: now },
      },
    });

    if (existingToken) {
      return {
        ok: false,
        error: "Ya se ha enviado un correo de verificación recientemente. Intenta en unos minutos.",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

    // Eliminar tokens anteriores
    await prisma.userVerificationToken.deleteMany({
      where: {
        userId,
        tokenType: TokenType.EMAIL_VERIFICATION,
      },
    });

    // Generar y guardar token, con retry si colisiona
    let verificationToken = generateVerificationCode();
    try {
      await prisma.userVerificationToken.create({
        data: {
          userId,
          verificationToken,
          expiresAt,
          tokenType: TokenType.EMAIL_VERIFICATION,
        },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        verificationToken = generateVerificationCode(); // reintentar
        await prisma.userVerificationToken.create({
          data: {
            userId,
            verificationToken,
            expiresAt,
            tokenType: TokenType.EMAIL_VERIFICATION,
          },
        });
      } else {
        throw error;
      }
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
