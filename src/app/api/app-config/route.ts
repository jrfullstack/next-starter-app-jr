// /app/api/app-config/route.ts
import { NextResponse } from "next/server";

import { getAppConfig } from "@/actions/config/get-app-config";

export async function GET() {
  const config = await getAppConfig();
  return NextResponse.json(config);
}
