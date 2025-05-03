import type { DefaultSession } from "next-auth";

import type { SessionUser } from "@/types/user.interface";

declare module "next-auth" {
  interface Session {
    user: SessionUser & DefaultSession["user"];
  }
}
