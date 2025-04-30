// types/app-config.d.ts
export interface AppConfig {
  readonly id: number;

  // General
  readonly contactEmail: string | null;
  readonly logoUrl: string | null;
  readonly isMaintenanceMode: boolean;
  readonly googleAnalyticsTrackingId: string | null;

  // Usuario
  readonly isUserSignUpEnabled: boolean;
  readonly maxActiveSessionsPerUser: number | null;
  readonly isSingleUserPerIpEnforced: boolean;
  readonly isEmailVerificationRequired: boolean;
  readonly isGlobalTwoFactorAuthEnabled: boolean;
  readonly sessionTimeoutLimitMinutes: number | null;

  // SEO Global
  readonly siteDisplayName: string | null;
  readonly siteDescription: string | null;
  readonly siteUrl: string | null;
  readonly faviconUrl: string | null;
  readonly defaultLocale: string;
  readonly isSiteNoIndexEnabled: boolean;
  readonly seoDefaultKeywords: string | null;

  // Fechas
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
  readonly siteDisplayName: string;
  readonly siteUrl: string;
  readonly siteDescription: string;
  readonly googleAnalyticsTrackingId: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly seoDefaultKeywords: string[];
}
