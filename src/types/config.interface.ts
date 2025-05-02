// types/app-config.d.ts
export interface AppConfig {
  id: number;

  // General
  contactEmail: string | null;
  logoUrl: string | null;
  isMaintenanceMode: boolean;
  googleAnalyticsTrackingId: string | null;

  // Usuario
  isUserSignUpEnabled: boolean;
  maxActiveSessionsPerUser: number | null;
  isSingleUserPerIpEnforced: boolean;
  isEmailVerificationRequired: boolean;
  isGlobalTwoFactorAuthEnabled: boolean;
  sessionTimeoutLimitMinutes: number | null;

  // SEO Global
  siteDisplayName: string | null;
  siteDescription: string | null;
  siteUrl: string | null;
  faviconUrl: string | null;
  defaultLocale: string;
  isSiteNoIndexEnabled: boolean;
  seoDefaultKeywords: string | null;

  // Fechas
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para la configuración parcial (útil en updates)
export type PartialAppConfig = Partial<AppConfig>;

export interface ResolvedAppConfig
  extends Omit<
    AppConfig,
    | "siteDisplayName"
    | "siteUrl"
    | "siteDescription"
    | "googleAnalyticsTrackingId"
    | "seoDefaultKeywords"
  > {
  // Propiedades que nunca serán null
  siteDisplayName: string;
  siteUrl: string;
  siteDescription: string;
  googleAnalyticsTrackingId: string;
  seoDefaultKeywords: string[];
}
