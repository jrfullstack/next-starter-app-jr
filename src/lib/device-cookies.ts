"use server";

import { cookies } from "next/headers";

export const setDeviceCookie = async (deviceId: string) => {
  const cookieStore = await cookies();
  cookieStore.set("deviceId", deviceId, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365, // 1 año
  });
};

export const getDeviceCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("deviceId")?.value ?? null;
};
