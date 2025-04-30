// types/app-config.d.ts
export interface AppConfig {
  readonly id: number;

  // General
  readonly contactEmail: string | null;
  readonly logoUrl: string | null;
  readonly maintenanceMode: boolean;
  readonly googleAnalyticsId: string | null;

  // Usuario
  readonly allowUserSignUps: boolean;
  readonly maxActiveSessionsPerUser: number | null;
  readonly restrictMultipleUsersPerIp: boolean;
  readonly requireEmailVerification: boolean;
  readonly enable2FA: boolean;
  readonly sessionTimeoutMinutes: number | null;

  // SEO Global
  readonly platformName: string | null;
  readonly platformUrl: string | null;
  readonly platformDescription: string | null;
  readonly defaultLocale: string;
  readonly faviconUrl: string | null;
  readonly globalNoIndex: boolean;
  readonly globalKeywords: string | null;

  // Fechas
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Tipo para la configuración parcial (útil en updates)
export type PartialAppConfig = Partial<AppConfig>;

export interface ResolvedAppConfig
  extends Omit<
    AppConfig,
    "platformName" | "platformDescription" | "platformUrl" | "googleAnalyticsId" | "globalKeywords"
  > {
  // Propiedades que nunca serán null
  readonly platformName: string;
  readonly platformDescription: string;
  readonly platformUrl: string;
  readonly googleAnalyticsId: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly globalKeywords: string[];
}
