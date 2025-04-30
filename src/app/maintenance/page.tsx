import type { Metadata } from "next";

import { getAppConfig } from "@/actions/config/get-app-config";
import { MaintenanceMode } from "@/components";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppConfig();

  const title = "En Modo Mantenimiento";
  const siteName = config.siteDisplayName;
  const description = "Estamos realizando tareas de mantenimiento. Por favor, vuelve pronto.";
  const locale = config.defaultLocale;
  const baseUrl = config.siteUrl;

  // Metadatos comunes
  const commonMetadata = {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
  };

  // Si está en modo no-index
  if (config.isSiteNoIndexEnabled) {
    return {
      ...commonMetadata,
      robots: { index: false, follow: false },
    };
  }

  return {
    ...commonMetadata,
    robots: { index: true, follow: true },

    icons: {
      icon: [{ url: config.faviconUrl ?? "/favicon/favicon.ico", sizes: "any" }],
      apple: config.faviconUrl ?? "/favicon/apple-touch-icon.png",
    },

    openGraph: {
      type: "website",
      locale,
      url: `${baseUrl}/maintenance`,
      title,
      description,
      siteName,
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
  };
}

export default async function MaintenanceModePage() {
  const { contactEmail } = await getAppConfig();

  return <MaintenanceMode contactEmail={contactEmail} />;
}
