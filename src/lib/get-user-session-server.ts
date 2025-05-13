import type { Session } from "next-auth";

import { auth } from "@/auth";

export const getUserSessionServer = async (): Promise<Session | null> => {
  const session = await auth();
  return session;
};
