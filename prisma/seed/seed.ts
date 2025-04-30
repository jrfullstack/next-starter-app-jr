// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@/app/generated/prisma";
import { initialData } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando proceso de seed...");

  // 1. Seed para AppConfig (configuración única)
  console.log("🛠 Configurando AppConfig...");
  await seedAppConfig();

  console.log("✅ Seed completado exitosamente");
}

async function seedAppConfig() {
  // Eliminar configuración existente si la hay
  await prisma.appConfig.deleteMany();

  // Insertar nueva configuración
  const configData = initialData.appConfig[0];

  await prisma.appConfig.upsert({
    where: { id: 1 },
    update: {
      id: configData.id ? Number(configData.id) : undefined,
      contactEmail: configData.contactEmail?.toString(),
      logoUrl: configData.logoUrl?.toString(),
      maintenanceMode: configData.maintenanceMode === true,
      allowUserSignUps: configData.allowUserSignUps === true,
      restrictMultipleUsersPerIp: configData.restrictMultipleUsersPerIp === true,
      requireEmailVerification: configData.requireEmailVerification === true,
      enable2FA: configData.enable2FA === true,
      googleAnalyticsId: configData.googleAnalyticsId?.toString(),
      maxActiveSessionsPerUser: configData.maxActiveSessionsPerUser?.valueOf() ?? undefined,
      sessionTimeoutMinutes: configData.sessionTimeoutMinutes?.valueOf() ?? undefined,
      platformName: configData.platformName?.toString(),
      platformUrl: configData.platformUrl?.toString(),
      platformDescription: configData.platformDescription?.toString(),
      defaultLocale: configData.defaultLocale?.toString(),
      globalNoIndex: configData.globalNoIndex === true,
      globalKeywords: configData.globalKeywords?.toString(),
    },
    create: {
      id: 1, // Configuración singleton
      contactEmail: configData.contactEmail?.toString() || null,
      logoUrl: configData.logoUrl?.toString() || null,
      maintenanceMode: configData.maintenanceMode === true ? true : false,
      googleAnalyticsId: configData.googleAnalyticsId?.toString() || null,

      allowUserSignUps: !!configData.allowUserSignUps || true,
      maxActiveSessionsPerUser: configData.maxActiveSessionsPerUser?.valueOf() || 3,
      restrictMultipleUsersPerIp: !!configData.restrictMultipleUsersPerIp || false,
      requireEmailVerification: !!configData.requireEmailVerification || true,
      enable2FA: !!configData.enable2FA || false,
      sessionTimeoutMinutes: configData.sessionTimeoutMinutes?.valueOf() || 30,

      platformName: configData.platformName?.toString() || "Mi Aplicación",
      platformUrl: configData.platformUrl?.toString() || "http://localhost:3000",
      platformDescription:
        configData.platformDescription?.toString() || "Bienvenido a la aplicación",

      defaultLocale: configData.defaultLocale?.toString() || "es",
      globalNoIndex: !!configData.globalNoIndex || false,
      globalKeywords: configData.globalKeywords?.toString() || null,
    },
  });
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
