"use server";

import { unstable_cache as cache } from "next/cache";

import { defaultConfig } from "@/constants";
import prisma from "@/lib/prisma";
import type { ResolvedAppConfig } from "@/types";

// Esta función se ejecutará UNA sola vez por request (o por ruta si está estática)
// y se cachea por Next.js internamente
// export const getAppConfig =
export const getAppConfig = cache(
  async (): Promise<ResolvedAppConfig> => {
    try {
      const config = await prisma.appConfig.findUnique({ where: { id: 1 } });

      // Procesamiento seguro de seoDefaultKeywords
      const processSeoDefaultKeywords = (keywords: string | null): string[] => {
        if (!keywords) return defaultConfig.seoDefaultKeywords;
        if (Array.isArray(keywords)) return keywords; // Por si acaso ya es array
        return keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
      };

      const {
        emailPassEnc, // 🚫 lo omitimos intencionalmente
        ...safeConfig
      } = config ?? {};

      // Si no existe la config en la DB, devolvemos valores por defecto
      // Combina la configuración de DB con los valores por defecto
      return {
        ...defaultConfig,
        ...safeConfig,
        siteDisplayName: config?.siteDisplayName ?? defaultConfig.siteDisplayName,
        siteDescription: config?.siteDescription ?? defaultConfig.siteDescription,
        siteUrl: config?.siteUrl ?? defaultConfig.siteUrl,
        googleAnalyticsTrackingId:
          config?.googleAnalyticsTrackingId ?? defaultConfig.googleAnalyticsTrackingId,
        seoDefaultKeywords: processSeoDefaultKeywords(config?.seoDefaultKeywords ?? null),
        updatedAt: config?.updatedAt ?? defaultConfig.updatedAt,
        createdAt: config?.createdAt ?? defaultConfig.createdAt,
      };
    } catch (error) {
      console.error("Error loading AppConfig:", error);
      return defaultConfig;
    }
  },
  ["get-app-config"],
  {
    tags: ["app-config"], // Tags para revalidación granular
  },
);
