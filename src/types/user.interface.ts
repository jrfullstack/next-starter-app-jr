import type { Role } from "@/app/generated/prisma";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;

  role: Role;
  emailVerified: Date;
}
