import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { getAppConfig } from "@/actions/config/get-app-config";
import { MaintenanceMode, ThemeProvider } from "@/components";
import { geistMono, geistSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

// Configuración del viewport dinámica
export async function generateViewport() {
  const { maintenanceMode } = await getAppConfig();

  return {
    themeColor: maintenanceMode ? "#6b7280" : "#ffffff",
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
    process.env.NODE_ENV !== "development" && config.googleAnalyticsId;

  // Valores base
  const title = config.platformName;
  const description = config.platformDescription;
  const baseUrl = config.platformUrl;
  const locale = config.defaultLocale;

  // Metadatos comunes
  const commonMetadata = {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    keywords: config.globalKeywords,
    applicationName: title,
  };

  // Si está en modo no-index
  if (config.globalNoIndex) {
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
      ...(isActiveGoogleAnalytics ? { google: config.googleAnalyticsId } : {}),
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
export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const { defaultLocale, maintenanceMode, platformName, googleAnalyticsId } = await getAppConfig();

  const isActiveGoogleAnalytics = process.env.NODE_ENV !== "development" && googleAnalyticsId;

  return (
    <html
      lang={defaultLocale}
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable, maintenanceMode ? "grayscale" : "")}
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        {isActiveGoogleAnalytics && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAnalyticsId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {maintenanceMode ? <MaintenanceMode platformName={platformName} /> : children}
        </ThemeProvider>
      </body>
    </html>
  );
}
