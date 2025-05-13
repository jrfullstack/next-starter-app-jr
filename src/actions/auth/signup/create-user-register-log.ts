"use server";
import { prisma } from "@/lib";

interface CreateUserRegistrationLogProps {
  userId: string;
  ipAddress: string;
  deviceId: string;
}

export const createUserRegistrationLog = async ({
  userId,
  ipAddress,
  deviceId,
}: CreateUserRegistrationLogProps) => {
  try {
    await prisma.userRegistrationLog.create({
      data: {
        userId: userId,
        ipAddress,
        deviceId,
      },
    });
  } catch (error) {
    console.error("Error al crear el registro de registro de usuario:", error);
  }
};
