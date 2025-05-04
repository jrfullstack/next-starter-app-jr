"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { onSignOut } from "@/actions/auth/sign-out";
import { Button, ModeToggle } from "@/components";

export default function Home() {
  const { data: session, update } = useSession();

  const updateSession = async () => {
    await update({
      ...session,
      user: {
        ...session?.user,
        emailVerified: null,
      },
    });
  };

  const logSession = async () => {
    console.warn(session);
  };
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-3xl">Bienvenido a mi plantilla para proyectos con NextJS</h1>

      <ModeToggle />
      <div className="flex flex-col space-y-2">
        <Link href="/auth/signup">Regístrate</Link>
        <Link href="/auth/signin">Iniciar session</Link>
        <Link href="/auth/verify">Verificar el email</Link>
        <Link href="/auth/verify/resend">reenviar email de verificación</Link>
        <Button onClick={onSignOut}>Salir</Button>
        <Button onClick={updateSession}>Update Session</Button>
        <Button onClick={logSession}>Log session</Button>
      </div>
    </div>
  );
}
