import { Role } from "@/app/generated/prisma";

interface SeedAppConfig {
  id?: string;
  contactEmail?: String;
  logoUrl?: String;
  isMaintenanceMode?: Boolean;
  googleAnalyticsTrackingId?: String;

  isUserSignUpEnabled?: Boolean;
  maxActiveSessionsPerUser?: Number;
  isSingleUserPerIpEnforced?: Boolean;
  isEmailVerificationRequired?: Boolean;
  isGlobalTwoFactorAuthEnabled?: Boolean;
  sessionTimeoutLimitMinutes?: Number;

  // SEO Global
  siteDisplayName?: String; // Nombre de la plataforma
  siteUrl?: String; // URL principal (https://midominio.com)
  siteDescription?: String;

  defaultLocale?: String;
  isSiteNoIndexEnabled?: Boolean;
  seoDefaultKeywords?: String;
}

export interface SeedUser {
  email: string;
  password: string;
  name?: string;
  role?: Role;
  profileImageUrl?: string;
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
      isSingleUserPerIpEnforced: false,
      isEmailVerificationRequired: true,
      isGlobalTwoFactorAuthEnabled: false,
      sessionTimeoutLimitMinutes: 30,

      siteDisplayName: "Mi Aplicación",
      siteUrl: "https://midominio.com",
      siteDescription: "La mejor plataforma para gestionar tu negocio",

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
