/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable sonarjs/no-commented-code */
import type { MetadataRoute } from "next";

import { getAppConfig } from "@/actions/config/get-app-config";

/**
 * Slugs simulados de rutas dinámicas.
 * En producción puedes reemplazarlos por datos reales de Prisma o una API.
 * const mediaSlugs = ["rap-beat-1", "instrumental-2024"];
 * const videoSlugs = ["video-intro", "backstage-scene"];
 */

/**
 * Genera dinámicamente el sitemap para motores de búsqueda.
 * Incluye rutas estáticas y dinámicas públicas, excluyendo privadas.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { platformUrl } = await getAppConfig();

  // Define rutas estáticas comunes del sitio
  const staticPaths = ["/", "/contact", "/terms", "/privacy", "/about"];

  const urls: MetadataRoute.Sitemap = [];

  // Agrega rutas estáticas al sitemap
  for (const path of staticPaths) {
    urls.push({
      url: `${platformUrl}${path}`,
      lastModified: new Date(), // si actualizas una de las pagina estáticas esto se pondrá en la fecha del deploy
    });
  }

  // Agrega rutas dinámicas para media
  /* for (const slug of mediaSlugs) {
    urls.push({
      url: `${platformUrl}/media/${slug}`,
      lastModified: media.updatedAt,
    });
  } */

  // Agrega rutas dinámicas para videos
  /* for (const slug of videoSlugs) {
    urls.push({
      url: `${platformUrl}/videos/${slug}`,
      lastModified: videos.updatedAt,
    });
  } */

  return urls;
}
