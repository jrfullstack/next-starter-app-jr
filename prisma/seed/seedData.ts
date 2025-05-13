import { Role } from "@/app/generated/prisma";

interface SeedAppConfig {
  id?: string;
  contactEmail?: String;
  logoUrl?: String;
  isMaintenanceMode?: Boolean;
  googleAnalyticsTrackingId?: String;

  isUserSignUpEnabled?: Boolean;
  maxActiveSessionsPerUser?: Number;
  isSingleUserPerIpOrDeviceEnforced?: Boolean;
  isEmailVerificationRequired?: Boolean;
  isGlobalTwoFactorAuthEnabled?: Boolean;
  sessionTimeoutLimitMinutes?: Number;

  // SEO Global
  siteDisplayName?: String; // Nombre de la plataforma
  siteUrl?: String; // URL principal (https://midominio.com)
  siteDescription?: String;
  faviconUrl?: String;

  defaultLocale?: String;
  isSiteNoIndexEnabled?: Boolean;
  seoDefaultKeywords?: String;
}

export interface SeedUser {
  email: string;
  password: string;
  name?: string;
  role?: Role;
  image?: string;
}

interface SeedData {
  appConfig: SeedAppConfig[];
  users: SeedUser[];
}

export const initialData: SeedData = {
  appConfig: [
    {
      id: "1",
      contactEmail: "soporte@midominio.com",
      logoUrl: "/images/logo.png",
      isMaintenanceMode: false,
      googleAnalyticsTrackingId: undefined,

      isUserSignUpEnabled: true,
      maxActiveSessionsPerUser: 3,
      isSingleUserPerIpOrDeviceEnforced: false,
      isEmailVerificationRequired: true,
      isGlobalTwoFactorAuthEnabled: false,
      sessionTimeoutLimitMinutes: 30,

      siteDisplayName: "Mi Aplicación",
      siteUrl: "https://midominio.com",
      siteDescription: "La mejor plataforma para gestionar tu negocio",
      faviconUrl: "/favicon/favicon.ico",

      defaultLocale: "es",
      isSiteNoIndexEnabled: false,
      seoDefaultKeywords: "negocio, gestión, plataforma, SaaS",
    },
  ],
  users: [
    {
      email: "admin@midominio.com",
      password: "Admin1234!",
      name: "Administrador",
      role: "ADMIN",
    },
    {
      email: "user@midominio.com",
      password: "User1234!",
      name: "Usuario",
      role: "USER",
    },
  ],
};
