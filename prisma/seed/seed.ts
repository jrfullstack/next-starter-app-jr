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
      isMaintenanceMode: configData.isMaintenanceMode === true,
      isUserSignUpEnabled: configData.isUserSignUpEnabled === true,
      isSingleUserPerIpEnforced: configData.isSingleUserPerIpEnforced === true,
      isEmailVerificationRequired: configData.isEmailVerificationRequired === true,
      isGlobalTwoFactorAuthEnabled: configData.isGlobalTwoFactorAuthEnabled === true,
      googleAnalyticsTrackingId: configData.googleAnalyticsTrackingId?.toString(),
      maxActiveSessionsPerUser: configData.maxActiveSessionsPerUser?.valueOf() ?? undefined,
      sessionTimeoutLimitMinutes: configData.sessionTimeoutLimitMinutes?.valueOf() ?? undefined,
      siteDisplayName: configData.siteDisplayName?.toString(),
      siteUrl: configData.siteUrl?.toString(),
      siteDescription: configData.siteDescription?.toString(),
      defaultLocale: configData.defaultLocale?.toString(),
      isSiteNoIndexEnabled: configData.isSiteNoIndexEnabled === true,
      seoDefaultKeywords: configData.seoDefaultKeywords?.toString(),
    },
    create: {
      id: 1, // Configuración singleton
      contactEmail: configData.contactEmail?.toString() || null,
      logoUrl: configData.logoUrl?.toString() || null,
      isMaintenanceMode: configData.isMaintenanceMode === true ? true : false,
      googleAnalyticsTrackingId: configData.googleAnalyticsTrackingId?.toString() || null,

      isUserSignUpEnabled: !!configData.isUserSignUpEnabled || true,
      maxActiveSessionsPerUser: configData.maxActiveSessionsPerUser?.valueOf() || 3,
      isSingleUserPerIpEnforced: !!configData.isSingleUserPerIpEnforced || false,
      isEmailVerificationRequired: !!configData.isEmailVerificationRequired || true,
      isGlobalTwoFactorAuthEnabled: !!configData.isGlobalTwoFactorAuthEnabled || false,
      sessionTimeoutLimitMinutes: configData.sessionTimeoutLimitMinutes?.valueOf() || 30,

      siteDisplayName: configData.siteDisplayName?.toString() || "Mi Aplicación",
      siteUrl: configData.siteUrl?.toString() || "http://localhost:3000",
      siteDescription: configData.siteDescription?.toString() || "Bienvenido a la aplicación",

      defaultLocale: configData.defaultLocale?.toString() || "es",
      isSiteNoIndexEnabled: !!configData.isSiteNoIndexEnabled || false,
      seoDefaultKeywords: configData.seoDefaultKeywords?.toString() || null,
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
