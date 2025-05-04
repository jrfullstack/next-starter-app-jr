"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { initialData } from "./seedData";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// if (!process.env.NODE_ENV || process.env.NODE_ENV !== "development") {
//   console.log(process.env.NODE_ENV);
//   throw new Error("Este script solo puede ejecutarse en entorno de desarrollo.");
// }

async function main() {
  console.log("🌱 Iniciando proceso de seed...");

  // 1. Seed para AppConfig (configuración única)
  console.log("🛠 Configurando AppConfig...");
  await seedAppConfig();

  console.log("🛠 Configurando Users...");
  await seedUsers();

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
      emailUser: configData.contactEmail?.toString(),
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
      faviconUrl: configData.faviconUrl?.toString(),
      defaultLocale: configData.defaultLocale?.toString(),
      isSiteNoIndexEnabled: configData.isSiteNoIndexEnabled === true,
      seoDefaultKeywords: configData.seoDefaultKeywords?.toString(),
    },
    create: {
      id: 1, // Configuración singleton
      emailUser: configData.contactEmail?.toString() || null,
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
      faviconUrl: configData.faviconUrl?.toString() || "/favicon/favicon.ico",

      defaultLocale: configData.defaultLocale?.toString() || "es",
      isSiteNoIndexEnabled: !!configData.isSiteNoIndexEnabled || false,
      seoDefaultKeywords: configData.seoDefaultKeywords?.toString() || null,
    },
  });
}

async function seedUsers() {
  console.log("👥 Seed de usuarios...");

  await prisma.userVerificationToken.deleteMany();
  await prisma.user.deleteMany();

  for (const user of initialData.users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        role: user.role ?? "USER",
        hashedPassword,
        profileImageUrl: user.profileImageUrl,
      },
    });
  }

  console.log("✅ Usuarios insertados");
}

// if (process.env.NODE_ENV === "development") {
main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// } else {
//   console.log("🚫 Seed script bloqueado fuera del entorno de desarrollo.");
// }
