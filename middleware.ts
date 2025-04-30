/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable sonarjs/todo-tag */
/* eslint-disable eslint-comments/disable-enable-pair */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAppConfig } from "@/actions/config/get-app-config";

export async function middleware(request: NextRequest) {
  try {
    // 1. Verificar primero rutas excluidas (más eficiente que el matcher)
    const pathname = request.nextUrl.pathname;
    if (
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/maintenance") ||
      pathname === "/favicon.ico" ||
      pathname === "/sitemap.xml" ||
      pathname === "/robots.txt"
    ) {
      return NextResponse.next();
    }

    // 2. Usar getAppConfig (ya cacheado)
    const { isMaintenanceMode: maintenanceMode } = await getAppConfig();

    // TODO: agregar cuando tengas los usuarios
    // Verificar si hay token (sesión autenticada)
    // const token = await getToken({ req: request });
    // const userRole = token?.role;

    // Permitir acceso a admins autenticados
    // const isAdmin = userRole === "ADMIN";\
    // simulando un admin
    const isAdmin = true;

    if (maintenanceMode && !isAdmin) {
      const response = NextResponse.rewrite(new URL("/maintenance", request.url), {
        status: 503,
      });
      response.headers.set("Retry-After", "3600");
      return response;
    }

    // 3. Redirigir si está en mantenimiento
    // if (maintenanceMode) {
    //   const response = NextResponse.rewrite(new URL("/maintenance", request.url), {
    //     status: 503,
    //   });
    //   response.headers.set("Retry-After", "3600"); // 1 hora para reintentos
    //   return response;
    // }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // En producción, considera enviar el error a un servicio de monitoreo
    return NextResponse.next(); // Fallar abierto (open fail)
  }
}

// Opcional: Matcher como respaldo (Next.js recomienda esta aproximación)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|maintenance|sitemap.xml|robots.txt).*)"],
};
