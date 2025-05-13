"use server";

import { upsertUserSession } from "@/actions/auth/session/upsert-user-session";
import { createUserRegistrationLog } from "@/actions/auth/signup/create-user-register-log";
import { prisma } from "@/lib";
import { AuthError } from "@/lib/errors/auth-errors";

export const registerUserIfNotExistsOauth = async (
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  },
  deviceId: string,
  ipAddress: string,
  userAgent: string,
  maxActiveSessionsPerUser: number,
) => {
  if (!user.name || !user.email) {
    throw new AuthError("MISSING_GOOGLE_INFO");
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        image: user.image || undefined,
        hashedPassword: null,
        emailVerified: new Date(),
      },
    });

    await createUserRegistrationLog({
      userId: createdUser.id,
      deviceId,
      ipAddress,
    });

    await upsertUserSession({
      userId: createdUser.id,
      deviceId,
      ipAddress,
      userAgent,
      maxActiveSessions: maxActiveSessionsPerUser ?? 3,
    });
  } catch (error) {
    console.error("Error al crear usuario y registrar log:", error);
    if (error instanceof AuthError) throw error;
    throw new AuthError("UNKNOWN_ERROR");
  }
};
