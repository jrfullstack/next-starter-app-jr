import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: Role;
    emailVerified?: Date | null;
    profileImageUrl?: string;
  }
}
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

import type { Role } from "./app/generated/prisma";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth/signin", // personalizada
    verifyRequest: "/auth/verify", // para magic links
    newUser: "/auth/signin", // si quieres onboarding post-verificación
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email?.toLocaleLowerCase() },
        });

        if (existingUser) {
          // Si el usuario ya existe, usar sus datos de la base de datos
          user.name = existingUser.name;
          user.email = existingUser.email;

          // Actualizar el lastLogin
          await prisma.user.update({
            where: { email: user.email!.toLocaleLowerCase() },
            data: {
              // lastLogin: new Date(), // Establecer la fecha actual de inicio de sesión
            },
          });
        } else {
          // Si el usuario no existe, crearlo en la base de datos
          // await createUserWithSubscriptions({
          //   userName: user.name!,
          //   userEmail: user.email!.toLocaleLowerCase(),
          // });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Actualizar el token cuando se verifica el email
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.profileImageUrl = user.profileImageUrl;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as Role;
        session.user.name = token.name as string;
        session.user.profileImageUrl = token.profileImageUrl as string;

        session.user.emailVerified = token.emailVerified as Date;
      }
      return session;
    },
  },

  providers: [
    // ✅ Opcional: Google
    Google,

    // ✅ Credentials
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
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        };
      },
    }),
  ],
};
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
