"use server";

import { revalidateTag } from "next/cache";

import prisma from "@/lib/prisma";
import type { PartialAppConfig } from "@/types";

export const updateAppConfig = async (data: PartialAppConfig) => {
  try {
    const updatedConfig = await prisma.appConfig.update({
      where: { id: 1 },
      data: {
        ...data,
        updatedAt: new Date(), // Siempre actualiza la fecha de modificación
      },
    });

    // Revalidamos la caché
    revalidateTag("app-config");

    return updatedConfig;
  } catch (error) {
    console.error("Error updating app config:", error);
    throw new Error("Failed to update configuration");
  }
};
