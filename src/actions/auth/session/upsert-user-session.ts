"use server";

import prisma from "@/lib/prisma";

interface UpsertUserSessionOptions {
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  maxActiveSessions?: number;
  sessionDurationMinutes?: number;
}

export async function upsertUserSession({
  userId,
  deviceId,
  ipAddress,
  userAgent,
  maxActiveSessions = 3,
  sessionDurationMinutes = 60 * 24 * 7, // 7 días
}: UpsertUserSessionOptions): Promise<void> {
  const sessionExpiresAt = new Date(Date.now() + sessionDurationMinutes * 60 * 1000);

  const [activeSessions, existingSession] = await Promise.all([
    prisma.userSession.findMany({
      where: { userId },
      orderBy: { sessionExpiresAt: "asc" },
    }),
    prisma.userSession.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    }),
  ]);

  if (existingSession) {
    await prisma.userSession.update({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
      data: {
        ipAddress,
        userAgent,
        sessionExpiresAt,
        updatedAt: new Date(),
        lastSignInAt: new Date(),
      },
    });
  } else {
    if (activeSessions.length >= maxActiveSessions) {
      const oldest = activeSessions[0];
      if (oldest?.deviceId) {
        await prisma.userSession.delete({
          where: {
            userId_deviceId: {
              userId,
              deviceId: oldest.deviceId,
            },
          },
        });
      }
    }

    await prisma.userSession.create({
      data: {
        userId,
        deviceId,
        ipAddress,
        userAgent,
        sessionExpiresAt,
        lastSignInAt: new Date(),
      },
    });
  }
}
