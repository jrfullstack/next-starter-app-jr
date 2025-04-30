import type { ResolvedAppConfig } from "@/types";

// Valores por defecto (debe satisfacer el tipo ResolvedAppConfig)
export const defaultConfig: ResolvedAppConfig = {
  id: 1,
  contactEmail: null,
  logoUrl: null,
  maintenanceMode: false,
  googleAnalyticsId: "",

  allowUserSignUps: true,
  maxActiveSessionsPerUser: 3,
  restrictMultipleUsersPerIp: false,
  requireEmailVerification: true,
  enable2FA: false,
  sessionTimeoutMinutes: 30,

  platformName: "Nueva Aplicación",
  platformDescription: "Bienvenido a tu nueva app",
  platformUrl: `http://localhost:${process.env.PORT || 3000}`,
  defaultLocale: "es",
  globalNoIndex: false,
  globalKeywords: [],
  faviconUrl: null,

  createdAt: new Date(),
  updatedAt: new Date(),
};
