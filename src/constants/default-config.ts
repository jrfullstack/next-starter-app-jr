import type { ResolvedAppConfig } from "@/types";

// Valores por defecto (debe satisfacer el tipo ResolvedAppConfig)
export const defaultConfig: ResolvedAppConfig = {
  id: 1,
  logoUrl: null,
  isMaintenanceMode: false,
  googleAnalyticsTrackingId: "",

  isUserSignUpEnabled: true,
  maxActiveSessionsPerUser: 3,
  isSingleUserPerIpEnforced: false,
  isEmailVerificationRequired: true,
  isGlobalTwoFactorAuthEnabled: false,
  sessionTimeoutLimitMinutes: 30,

  siteDisplayName: "Nueva Aplicación",
  siteDescription: "Bienvenido a tu nueva app",
  siteUrl: `http://localhost:${process.env.PORT || 3000}`,
  defaultLocale: "es",
  isSiteNoIndexEnabled: false,
  seoDefaultKeywords: [],
  faviconUrl: null,

  // SMTP
  emailHost: null,
  emailPort: 587,
  emailUser: "noreply@midominio.com",
  isEmailConfigured: false,

  createdAt: new Date(),
  updatedAt: new Date(),
};
