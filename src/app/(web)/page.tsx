"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Button, ModeToggle, UserNav } from "@/components";

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
    <div className="min-h-screen items-center justify-items-center gap-16 space-y-8 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-3xl">Bienvenido a mi plantilla para proyectos con NextJS</h1>
      <div className="flex flex-row space-x-2">
        <ModeToggle />
        <UserNav />
      </div>
      <div className="flex flex-col space-y-2">
        <Link href="/auth/signup">Regístrate</Link>
        <Link href="/auth/signin">Iniciar session</Link>
        <Link href="/auth/verify">Verificar el email</Link>
        <Link href="/auth/verify/resend">reenviar email de verificación</Link>
        <Link href="/admin">Panel de Administración</Link>
        <Button
          onClick={async () => {
            await signOut({
              redirect: true,
              redirectTo: "/",
            });
          }}
        >
          Salir
        </Button>
        <Button onClick={updateSession}>Update Session</Button>
        <Button onClick={logSession}>Log session</Button>
      </div>
    </div>
  );
}
