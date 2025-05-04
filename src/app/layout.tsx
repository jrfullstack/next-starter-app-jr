import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { getAppConfig } from "@/actions/config/get-app-config";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components";
import { geistMono, geistSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { Role } from "./generated/prisma";

import "@/styles/globals.css";

// Configuración del viewport dinámica
export async function generateViewport() {
  return {
    colorScheme: "light dark",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  } satisfies Viewport;
}

// Metadatos dinámicos mejorados
export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();
  const isActiveGoogleAnalytics =
    process.env.NODE_ENV !== "development" && config.googleAnalyticsTrackingId;

  // Valores base
  const title = config.siteDisplayName;
  const description = config.siteDescription;
  const baseUrl = config.siteUrl;
  const locale = config.defaultLocale;

  // Metadatos comunes
  const commonMetadata = {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    keywords: config.seoDefaultKeywords,
    applicationName: title,
  };

  // Si está en modo no-index
  if (config.isSiteNoIndexEnabled) {
    return {
      ...commonMetadata,
      robots: { index: false, follow: false },
      alternates: {
        canonical: baseUrl,
      },
    };
  }

  // Metadatos completos para indexación
  return {
    ...commonMetadata,
    robots: { index: true, follow: true },

    icons: {
      icon: [{ url: config.faviconUrl ?? "/favicon/favicon.ico", sizes: "any" }],
      apple: config.faviconUrl ?? "/favicon/apple-touch-icon.png",
    },

    // manifest: "/favicon/site.webmanifest", // investigar esto
    verification: {
      ...(isActiveGoogleAnalytics ? { google: config.googleAnalyticsTrackingId } : {}),
    },
    openGraph: {
      type: "website",
      locale,
      url: baseUrl,
      title,
      description,
      siteName: title,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.png"],
    },
    // other: {
    //   "msapplication-TileColor": "#ffffff", // investigar esto
    //   "msapplication-config": "/favicon/browserconfig.xml", // investigar esto
    // },
  };
}

// Componente principal del layout
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const isAdmin = session?.user?.role === Role.ADMIN;
  const { defaultLocale, isMaintenanceMode, googleAnalyticsTrackingId } = await getAppConfig();

  const isActiveGoogleAnalytics =
    process.env.NODE_ENV !== "development" && googleAnalyticsTrackingId;

  return (
    <html
      lang={defaultLocale}
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable)}
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        {isActiveGoogleAnalytics && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAnalyticsTrackingId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {isMaintenanceMode && isAdmin && (
              <div className="bg-yellow-200 py-2 text-center text-sm font-medium text-yellow-900">
                ⚠️ Modo mantenimiento activo. Estás viendo el sitio como administrador.
              </div>
            )}
            {children}
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
