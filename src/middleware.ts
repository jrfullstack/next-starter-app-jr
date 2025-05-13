import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

import { Role } from "@/app/generated/prisma";
import { prisma } from "@/lib";

const LAST_SESSION_PING_COOKIE = "lastSessionPing";
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const SESSION_EXTENSION_DAYS = 7;

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    if (isPathExcluded(pathname)) return NextResponse.next();

    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const appConfig = await getAppConfig(request);

    if (shouldBlockForMaintenance(token?.role as string | undefined, appConfig.isMaintenanceMode)) {
      return buildMaintenanceResponse(request);
    }

    const res = NextResponse.next();
    if (token?.id && token?.deviceId && token?.sessionExpiresAt) {
      await maybeExtendSession(request, res, token, appConfig.maxActiveSessionsPerUser);
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

function isPathExcluded(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/maintenance") ||
    pathname === "/favicon/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  );
}

async function getAppConfig(request: NextRequest) {
  const response = await fetch(`${request.nextUrl.origin}/api/app-config`);
  return response.json();
}

function shouldBlockForMaintenance(role: string | undefined, isMaintenanceMode: boolean): boolean {
  return isMaintenanceMode && role !== Role.ADMIN;
}

function buildMaintenanceResponse(request: NextRequest): NextResponse {
  const response = NextResponse.rewrite(new URL("/maintenance", request.url), { status: 503 });
  response.headers.set("Retry-After", "3600");
  return response;
}

async function maybeExtendSession(
  request: NextRequest,
  res: NextResponse,
  token: JWT,
  maxSessions: number,
) {
  const now = new Date();
  const lastPingRaw = request.cookies.get(LAST_SESSION_PING_COOKIE)?.value;
  const lastPing = lastPingRaw ? Number(lastPingRaw) : 0;

  if (now.getTime() - lastPing <= ONE_DAY_MS) return;

  const session = await prisma.userSession.findUnique({
    where: {
      userId_deviceId: {
        userId: token.id as string,
        deviceId: token.deviceId as string,
      },
    },
  });

  if (!session?.sessionExpiresAt) return;

  const isExpired = session.sessionExpiresAt.getTime() < now.getTime();
  if (isExpired) {
    const count = await prisma.userSession.count({
      where: { userId: token.id as string },
    });
    if (count > maxSessions) return;
  }

  await prisma.userSession.update({
    where: {
      userId_deviceId: {
        userId: token.id as string,
        deviceId: token.deviceId as string,
      },
    },
    data: {
      sessionExpiresAt: new Date(now.getTime() + SESSION_EXTENSION_DAYS * ONE_DAY_MS),
      updatedAt: now,
    },
  });

  res.cookies.set(LAST_SESSION_PING_COOKIE, `${now.getTime()}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY_MS / 1000,
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|maintenance|sitemap.xml|robots.txt).*)"],
};
