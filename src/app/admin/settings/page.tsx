import Link from "next/link";

import { getAppConfig } from "@/actions/config/get-app-config";
import {
  ContentLayout,
  GeneralSettings,
  SeoSettings,
  SmtpSettings,
  UserSettings,
} from "@/components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SettingsPage() {
  const {
    siteDisplayName,
    siteUrl,
    siteDescription,
    faviconUrl,
    defaultLocale,
    isSiteNoIndexEnabled,
    seoDefaultKeywords,
    logoUrl,
    isMaintenanceMode,
    googleAnalyticsTrackingId,
    isUserSignUpEnabled,
    maxActiveSessionsPerUser,
    isSingleUserPerIpEnforced,
    isEmailVerificationRequired,
    isGlobalTwoFactorAuthEnabled,
    sessionTimeoutLimitMinutes,
    emailHost,
    emailPort,
    emailUser,
    isEmailConfigured,
  } = await getAppConfig();

  return (
    <ContentLayout title="Account">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configuración</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h1 className="text-3xl font-bold tracking-tight">Configuración de la aplicación</h1>
        <p className="text-muted-foreground mt-2">
          Administra la configuración global de la plataforma.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="user">Usuario</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettings
            siteDisplayName={siteDisplayName}
            siteUrl={siteUrl}
            logoUrl={logoUrl}
            isMaintenanceMode={isMaintenanceMode}
            googleAnalyticsTrackingId={googleAnalyticsTrackingId}
          />
        </TabsContent>
        <TabsContent value="user">
          <UserSettings
            isUserSignUpEnabled={isUserSignUpEnabled}
            maxActiveSessionsPerUser={maxActiveSessionsPerUser}
            isSingleUserPerIpEnforced={isSingleUserPerIpEnforced}
            isEmailVerificationRequired={isEmailVerificationRequired}
            isGlobalTwoFactorAuthEnabled={isGlobalTwoFactorAuthEnabled}
            sessionTimeoutLimitMinutes={sessionTimeoutLimitMinutes}
          />
        </TabsContent>
        <TabsContent value="seo">
          <SeoSettings
            siteDisplayName={siteDisplayName}
            siteUrl={siteUrl}
            siteDescription={siteDescription}
            faviconUrl={faviconUrl}
            defaultLocale={defaultLocale}
            isSiteNoIndexEnabled={isSiteNoIndexEnabled}
            seoDefaultKeywords={seoDefaultKeywords}
          />
        </TabsContent>
        <TabsContent value="smtp">
          <SmtpSettings
            emailHost={emailHost}
            emailPort={emailPort}
            emailUser={emailUser}
            isEmailConfigured={isEmailConfigured}
          />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
