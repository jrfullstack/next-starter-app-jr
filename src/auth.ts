import { cookies, headers } from "next/headers";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { upsertUserSession } from "@/actions/auth/session/upsert-user-session";
import { registerUserIfNotExistsOauth } from "@/actions/auth/signup/register-user-if-not-exists-oauth";
import { validateDevice } from "@/actions/auth/signup/validate-device";
import { getAppConfig } from "@/actions/config/get-app-config";
import { Role } from "@/app/generated/prisma";
import { getClientIp, getUserAgent } from "@/lib";
import prisma from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    newUser: "/auth/signin", // si quieres onboarding post-verificación
    signIn: "/auth/signin", // personalizada
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      const { isUserSignUpEnabled, isSingleUserPerIpOrDeviceEnforced, maxActiveSessionsPerUser } =
        await getAppConfig();

      const cookieStore = await cookies();
      const deviceId = cookieStore.get("deviceId")?.value || "";
      const headersList = await headers();
      const ipAddress = getClientIp(headersList) || "";
      const userAgent = getUserAgent(headersList) || "";
      const callbackUrl = cookieStore.get("callbackUrl")?.value || "/";

      // si esta deshabilitado el registro de usuarios, lanzamos un error
      if (!isUserSignUpEnabled) return "/auth/signup?error=registration_disabled";

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email?.toLowerCase() },
      });

      if (existingUser) {
        user.name = existingUser.name;
        user.email = existingUser.email;
        user.image = existingUser.image || user.image;

        const sessionExpiresAt = new Date(Date.now() + 60 * 24 * 7 * 60 * 1000); // opcional si lo sigues usando

        user.sessionExpiresAt = sessionExpiresAt;
        user.deviceId = deviceId;

        await upsertUserSession({
          userId: existingUser.id,
          deviceId,
          ipAddress,
          userAgent,
          maxActiveSessions: maxActiveSessionsPerUser ?? 3,
        });
        return true;
      }

      try {
        // si esta habilitado la restricción de un usuario por ip o dispositivo, validamos que no exista un usuario con el mismo dispositivo o ip
        if (isSingleUserPerIpOrDeviceEnforced) {
          const result = await validateDevice({ deviceId, ipAddress });
          if (!result?.ok) {
            return `/auth/signup?error=duplicate_device_or_ip&callbackUrl=${encodeURIComponent(callbackUrl)}`;
          }
        }

        // si no existe el usuario, lo creamos
        await registerUserIfNotExistsOauth(
          user,
          deviceId,
          ipAddress,
          userAgent,
          maxActiveSessionsPerUser ?? 3,
        );

        return true;
      } catch (error) {
        console.error("Error durante el registro:", error);
        const cookieStore = await cookies();
        const callbackUrl = cookieStore.get("callbackUrl")?.value || "/";
        return `/auth/signup?error=registration_failed&callbackUrl=${encodeURIComponent(callbackUrl)}`;
      }
    },

    async jwt({ token, user, trigger, session }) {
      // Actualizar el token cuando se verifica el email
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user) {
        // enviamos los datos del usuario desde la base de datos
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        token.id = dbUser?.id || (user.id as string);
        token.name = dbUser?.name || (user.name as string);
        token.email = dbUser?.email || (user.email as string);
        token.role = dbUser?.role || Role.USER;
        token.image = dbUser?.image;
        token.emailVerified = dbUser?.emailVerified;
        token.deviceId = user?.deviceId as string;

        // maxActiveSessionsPerUser
        if (user.sessionExpiresAt) {
          token.sessionExpiresAt = user.sessionExpiresAt;
        }
        token.deviceId = user?.deviceId as string;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as Role;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.emailVerified = token.emailVerified as Date;

        session.sessionExpiresAt = token.sessionExpiresAt as Date;
        session.user.deviceId = token.deviceId as string;
      }
      return session;
    },
  },

  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validación básica
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (!bcrypt.compareSync(password as string, user?.hashedPassword || "")) {
          throw new Error("Invalid credentials");
        }
        if (!user) return null;

        // podemos evitar el login si no esta verificado
        // if (!user.emailVerified) {
        //   throw new Error("Email not verified");
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
};
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
