"use server";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { sendEmailVerification } from "@/actions/auth/email-verify/send-email-verification";
import { createUserRegistrationLog } from "@/actions/auth/signup/create-user-register-log";
import { validateDevice } from "@/actions/auth/signup/validate-device";
import { getAppConfig } from "@/actions/config/get-app-config";
import { getClientIp, prisma } from "@/lib";

type CreateUserCredentialsResponse = { ok: true; message?: string } | { ok: false; error: string };

const signUpSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  image: z.string().max(255, "La imagen debe tener menos de 255 caracteres").optional(),
});

export const createUserCredentials = async (
  formData: z.infer<typeof signUpSchema>,
  deviceId: string,
): Promise<CreateUserCredentialsResponse> => {
  try {
    const { isUserSignUpEnabled, isEmailVerificationRequired, isSingleUserPerIpOrDeviceEnforced } =
      await getAppConfig();
    const headersList = await headers();
    const ipAddress = getClientIp(headersList);

    if (!isUserSignUpEnabled) {
      return {
        ok: false,
        error: "El registro de usuarios está deshabilitado.",
      };
    }

    // Validación por IP/dispositivo
    if (isSingleUserPerIpOrDeviceEnforced) {
      const result = await validateDevice({ deviceId, ipAddress });
      if (!result?.ok) {
        return {
          ok: false,
          error: result.error ?? "Ya has creado una cuenta, intenta iniciar sesión.",
        };
      }
    }

    // Validación con Zod
    const parsed = signUpSchema.safeParse(formData);
    if (!parsed.success) {
      const formatted = parsed.error.flatten().fieldErrors;
      console.error("Error de validación:", formatted);

      return { ok: false, error: `Error de validación: ${JSON.stringify(formatted)}` };
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

    // Registrar log de IP/dispositivo
    await createUserRegistrationLog({ userId: user.id, ipAddress: ipAddress ?? "", deviceId });

    // Verificar si hay que enviar email de verificación
    if (isEmailVerificationRequired) {
      await sendEmailVerification({ emailTo: normalizedEmail, userId: user.id });
    }

    return { ok: true, message: "Registro exitoso" };
  } catch (error) {
    console.error("Error en createUser:", error);
    return {
      ok: false,
      error: "No se pudo registrar al usuario. Intenta más tarde.",
    };
  }
};
