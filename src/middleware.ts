import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { Role } from "./app/generated/prisma";

export async function middleware(request: NextRequest) {
  try {
    // 🔄 Autentica la sesión actual (también actualiza la expiración de sesión automáticamente)
    const secret = process.env.AUTH_SECRET;
    const token = await getToken({ req: request, secret });

    // ✅ Verificamos primero si la ruta debe ser ignorada por el middleware (por eficiencia)
    const pathname = request.nextUrl.pathname;
    if (
      pathname.startsWith("/api") || // Rutas de API
      pathname.startsWith("/_next") || // Recursos internos de Next.js (JS, CSS, etc.)
      pathname.startsWith("/maintenance") || // Página de mantenimiento
      pathname === "/favicon/favicon.ico" || // Ícono del navegador
      pathname === "/sitemap.xml" || // Mapa del sitio
      pathname === "/robots.txt" // Archivo para bots
    ) {
      return NextResponse.next(); // 👉 Continuamos sin hacer nada
    }

    // 🔧 Obtenemos configuración global desde la base de datos (usualmente cacheado)
    const response = await fetch(`${request.nextUrl.origin}/api/app-config`);
    const config = await response.json();
    const { isMaintenanceMode } = config;

    // 🔐 Comprobamos si el usuario autenticado tiene el rol "ADMIN"
    const isAdmin = token?.role === Role.ADMIN;

    // 🚧 Si estamos en modo mantenimiento y el usuario no es admin, redirigimos
    if (isMaintenanceMode && !isAdmin) {
      const response = NextResponse.rewrite(new URL("/maintenance", request.url), {
        status: 503, // Código estándar para "Servicio no disponible"
      });
      response.headers.set("Retry-After", "3600"); // 🕒 Sugerencia para que los bots reintenten en 1 hora
      return response;
    }

    // ✅ Si no hay modo mantenimiento o el usuario es admin, permitimos acceso
    return NextResponse.next();
  } catch (error) {
    // ⚠️ En caso de error en el middleware, mostramos en consola
    console.error("Middleware error:", error);

    // En producción podrías enviar este error a Sentry, LogRocket, etc.

    // 🚪 Continuamos permitiendo el acceso (fail open) para no bloquear la app por un error del middleware
    return NextResponse.next();
  }
}

// ⚙️ Configuración del middleware
// Este matcher indica en qué rutas se debe ejecutar el middleware.
// Ignoramos rutas de API, estáticos, imágenes, favicon y mantenimiento.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|maintenance|sitemap.xml|robots.txt).*)"],
};
