import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getBackendEmailAppConfig } from "@/actions/config/get-backend-email-app-config";
import { decrypt } from "@/lib/run-time/crypto-password";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const host = body.host?.trim();
    const port = Number.parseInt(body.port);
    const secure = Boolean(body.secure);
    const user = body.user?.trim();

    if (!host || !port || !user || Number.isNaN(port)) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios o puerto inválido." },
        { status: 400 },
      );
    }

    const config = await getBackendEmailAppConfig();

    if (!config?.emailPassEnc) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios." },
        { status: 400 },
      );
    }

    const pass = await decrypt(config?.emailPassEnc);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    // Verifica conexión SMTP sin enviar correos
    await transporter.verify();

    return NextResponse.json({ ok: true, message: "Conexión SMTP verificada correctamente." });
  } catch (error: unknown) {
    console.error("Error verificando SMTP:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { ok: false, message: "Error verificando SMTP", error: errorMessage },
      { status: 500 },
    );
  }
}
