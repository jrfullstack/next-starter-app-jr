import type { MetadataRoute } from "next";

import { getAppConfig } from "@/actions/config/get-app-config";

/**
 * Genera el archivo robots.txt dinámicamente.
 * Bloqueo global si el sitio está en mantenimiento o con noIndex global.
 * Excluye rutas privadas del índice de los motores de búsqueda.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { maintenanceMode, globalNoIndex, platformUrl } = await getAppConfig();

  const rules: MetadataRoute.Robots["rules"] = [];

  if (maintenanceMode || globalNoIndex) {
    // Si está activado el mantenimiento o noIndex, se bloquea completamente
    rules.push({
      userAgent: "*",
      disallow: "/",
    });
  } else {
    // Caso normal: permite el resto excepto rutas privadas
    rules.push({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/user-panel", "/auth", "/settings"],
    });
  }

  return {
    rules,
    sitemap: `${platformUrl}/sitemap.xml`,
    host: platformUrl,
  };
}
