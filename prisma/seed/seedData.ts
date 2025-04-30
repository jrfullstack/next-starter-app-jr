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
};
