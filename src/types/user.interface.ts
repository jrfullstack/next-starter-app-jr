import type { Role } from "@/app/generated/prisma";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  sessionExpiresAt?: Date;

  role: Role;
  emailVerified: Date;
}

declare module "next-auth" {
  interface User {
    role?: Role;
    emailVerified?: Date | null;
    image?: string;
    sessionExpiresAt?: Date;
    deviceId?: string;
  }

  interface Session {
    sessionExpiresAt?: Date;
  }
}
