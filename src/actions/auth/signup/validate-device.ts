"use server";

import prisma from "@/lib/prisma";

interface ValidateDeviceProps {
  deviceId?: string;
  ipAddress: string | null;
}

export const validateDevice = async ({ deviceId, ipAddress }: ValidateDeviceProps) => {
  const existing = await prisma.userRegistrationLog.findFirst({
    where: {
      OR: [{ ipAddress: ipAddress ?? "" }, { deviceId }],
      // los usuarios que se registraron hace mas de 30 días no se filtran
      // podríamos poner la opción de filtrar por fecha de registro
      createdAt: {
        gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 días
      },
    },
  });

  if (existing) {
    return {
      ok: false,
      error: "Ya has creado una cuenta, intenta iniciar sesión.",
    };
  }

  return {
    ok: true,
  };
};
