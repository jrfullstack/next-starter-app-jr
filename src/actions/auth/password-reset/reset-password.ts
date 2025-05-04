"use server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib";

const resetSchema = z.object({
  token: z.string().min(10, "Token inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

interface Props {
  token: string;
  password: string;
}

export const resetPassword = async (data: Props) => {
  const parse = resetSchema.safeParse(data);
  if (!parse.success) {
    return {
      ok: false,
      error: parse.error.errors[0]?.message || "Datos inválidos",
    };
  }

  const { token, password } = parse.data;

  try {
    const now = new Date();
    const userToken = await prisma.userVerificationToken.findUnique({
      where: { verificationToken: token },
    });

    if (!userToken || userToken.expiresAt < now) {
      return {
        ok: false,
        error: "Token inválido o expirado",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: userToken.userId },
      data: {
        hashedPassword,
        updatedAt: new Date(),
      },
    });

    await prisma.userVerificationToken.delete({
      where: { verificationToken: token },
    });

    return { ok: true, email: user.email };
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return {
      ok: false,
      error: "Error interno al restablecer la contraseña",
    };
  }
};
