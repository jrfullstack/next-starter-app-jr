"use server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib";

import { sendEmailVerification } from "../auth/email-verify/send-email-verification";
import { getAppConfig } from "../config/get-app-config";

const signUpSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const createUser = async (formData: z.infer<typeof signUpSchema>) => {
  try {
    // Validación con Zod
    const parsed = signUpSchema.safeParse(formData);
    if (!parsed.success) {
      const formatted = parsed.error.flatten().fieldErrors;
      console.error("Error de validación:", formatted);
      return {
        ok: false,
        error: `Error de validación:, ${formatted}`,
      };
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        ok: false,
        error: "Este correo ya está en uso.",
      };
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        hashedPassword,
        emailVerified: null,
      },
    });

    // Verificar si hay que enviar email de verificación
    const { isEmailVerificationRequired } = await getAppConfig();
    if (isEmailVerificationRequired) {
      try {
        await sendEmailVerification({ emailTo: normalizedEmail, userId: user.id });
      } catch (error) {
        console.error("Error enviando el correo de verificación:", error);
        // Puedes manejarlo de manera más elegante si lo consideras crítico
        // throw new Error("Error al enviar el correo de verificación.");
      }
    }

    return { ok: true, message: "Registro exitoso" };
  } catch (error) {
    console.error("Error en createUser:", error);
    return { ok: false, error: "Error desconocido al crear el usuario." };
  }
};
