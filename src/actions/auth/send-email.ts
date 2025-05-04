"use server";
export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface SendEmailResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<SendEmailResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/auth/send-email`, {
    method: "POST",
    body: JSON.stringify(options),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || "Error enviando correo" };
  }
  return { ok: true, message: data.message };
};
