import type { DefaultSession } from "next-auth";

import type { Role } from "@/interfaces";

declare module "next-auth" {
  interface Session {
    readonly user: {
      readonly id: string;
      readonly name: string;
      readonly email: string;
      readonly role: Role;
    } & DefaultSession["user"];
  }
}
