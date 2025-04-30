interface SeedAppConfig {
  id?: string;
  contactEmail?: String;
  logoUrl?: String;
  maintenanceMode?: Boolean;
  googleAnalyticsId?: String;

  allowUserSignUps?: Boolean;
  maxActiveSessionsPerUser?: Number;
  restrictMultipleUsersPerIp?: Boolean;
  requireEmailVerification?: Boolean;
  enable2FA?: Boolean;
  sessionTimeoutMinutes?: Number;

  // SEO Global
  platformName?: String; // Nombre de la plataforma
  platformUrl?: String; // URL principal (https://midominio.com)
  platformDescription?: String;

  defaultLocale?: String;
  globalNoIndex?: Boolean;
  globalKeywords?: String;
}

interface SeedData {
  appConfig: SeedAppConfig[];
  // SubscriptionPrice: SeedSubscriptionPrice[];
}

export const initialData: SeedData = {
  appConfig: [
    {
      id: "1",
      contactEmail: "soporte@midominio.com",
      logoUrl: "/images/logo.png",
      maintenanceMode: false,
      googleAnalyticsId: undefined,

      allowUserSignUps: true,
      maxActiveSessionsPerUser: 3,
      restrictMultipleUsersPerIp: false,
      requireEmailVerification: true,
      enable2FA: false,
      sessionTimeoutMinutes: 30,

      platformName: "Mi Aplicación",
      platformUrl: "https://midominio.com",
      platformDescription: "La mejor plataforma para gestionar tu negocio",

      defaultLocale: "es",
      globalNoIndex: false,
      globalKeywords: "negocio, gestión, plataforma, SaaS",
    },
  ],
};
