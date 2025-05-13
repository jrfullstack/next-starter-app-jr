"use server";
import { TokenType } from "@/app/generated/prisma";
import { PrismaClientKnownRequestError } from "@/app/generated/prisma/runtime/library";
import { prisma } from "@/lib";
import { generateVerificationCode } from "@/lib/run-time/generate-tokens-codes";

interface Props {
  userId: string;
  MAX_ATTEMPTS: number;
}

export const createVerificationCode = async ({ userId, MAX_ATTEMPTS }: Props) => {
  try {
    let verificationToken = generateVerificationCode();
    let attempts = 0;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 60 mins

    while (attempts < MAX_ATTEMPTS) {
      try {
        await prisma.userVerificationToken.create({
          data: {
            userId,
            verificationToken,
            expiresAt,
            tokenType: TokenType.EMAIL_VERIFICATION,
          },
        });
        break; // Si llegamos aquí, el token se creó exitosamente
      } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
          attempts++;
          if (attempts === MAX_ATTEMPTS) {
            throw new Error("No se pudo generar un token único después de varios intentos");
          }
          verificationToken = generateVerificationCode();
        } else {
          throw error;
        }
      }
    }

    return {
      ok: true,
      verificationToken,
    };
  } catch (error) {
    console.error("Error al crear el token de verificación:", error);
    return {
      ok: false,
      error: "Error al crear el token de verificación",
    };
  }
};
