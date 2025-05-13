import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// dejarlo en api por que el nodemailer no tiene soporte para el envío de correo en el lado del servidor
import type { SendEmailOptions } from "@/actions/auth/send-email";
import { getBackendEmailAppConfig } from "@/actions/config/get-backend-email-app-config";
import { decrypt } from "@/lib/run-time/crypto-password";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendEmailOptions;
    const { to, text, subject, html } = body;

    if (!to || !subject || !html || !text) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    if (
      typeof to !== "string" ||
      typeof subject !== "string" ||
      typeof html !== "string" ||
      typeof text !== "string"
    ) {
      return NextResponse.json({ ok: false, error: "Invalid field types" }, { status: 400 });
    }

    const config = await getBackendEmailAppConfig();

    if (!config || !config.emailPassEnc) {
      console.error("No hay configuración de email");
      return NextResponse.json(
        { ok: false, error: "Missing email configuration" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: config.emailHost || "",
      port: config.emailPort || 587,
      secure: config.emailPort === 465, // true para 465, false para otros
      auth: {
        user: config.emailUser!,
        pass: await decrypt(config.emailPassEnc),
      },
      tls: {
        rejectUnauthorized: false, // ajusta si estás usando certificados propios
      },
      connectionTimeout: 10_000, // 10s
    });

    await transporter.sendMail({
      to,
      from: config.emailUser!,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true, message: "Email enviado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ ok: false, error: "Failed to send email" }, { status: 500 });
  }
}
