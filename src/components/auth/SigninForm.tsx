"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getDeviceId } from "@/lib/run-time/get-device-id";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  isEmailConfigured: boolean;
}

export const SigninForm = ({ className, isEmailConfigured, ...props }: Readonly<Props>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "admin@midominio.com",

      // solo para pruebas
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      password: "Admin1234!",
    },
  });

  const handleCredentialSignIn = (data: SignInFormData) => {
    setErrorMessage("");

    const isSafeUrl = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//");
    const safeRedirect = isSafeUrl ? callbackUrl : "/";

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
          // Permitimos usar un callback URL si está disponible.
          safeRedirect,
        });

        if (res?.error) {
          setErrorMessage("Correo o contraseña inválidos");
        } else {
          router.push(safeRedirect);
        }
      } catch {
        setErrorMessage("Ha ocurrido un error al iniciar sesión. Inténtalo nuevamente.");
      }
    });
  };

  const handleSignin = async () => {
    try {
      const deviceId = await getDeviceId();
      Cookies.set("deviceId", deviceId);

      const isSafeUrl = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//");
      const safeRedirect = isSafeUrl ? callbackUrl : "/";

      await signIn("google", {
        redirectTo: safeRedirect,
      });
    } catch (error) {
      toast.error("Error iniciando autenticación.");
      console.error("Error en handleSignup:", error);
    }
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>Inicia sesión con tu método</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignin}
                  disabled={isPending}
                >
                  <FcGoogle />
                  Iniciar sesión con Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  O con tus credenciales
                </span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCredentialSignIn)} className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "El correo electrónico es obligatorio" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{ required: "La contraseña es obligatoria" }}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Contraseña</FormLabel>

                          {isEmailConfigured && (
                            <Link
                              href="/auth/forgot-password"
                              className="text-sm underline-offset-4 hover:underline"
                            >
                              ¿Olvidaste tu contraseña?
                            </Link>
                          )}
                        </div>
                        <FormControl>
                          <Input type="password" disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </form>
              </Form>
              {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/signup" className="underline underline-offset-4">
                  Regístrate
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        Al hacer clic en Continuar, aceptas nuestras{" "}
        <Link href="/terms-service">Condiciones de Servicio</Link> y nuestra{" "}
        <Link href="/privacy-policy">Política de Privacidad</Link>.
      </div>
    </section>
  );
};
