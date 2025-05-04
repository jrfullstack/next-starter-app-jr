"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { createUser } from "@/actions/users/create-user";
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
import { cn } from "@/lib";
import type { ResolvedAppConfig } from "@/types";

const signUpSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El correo no es válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La confirmación de la contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  appConfig: ResolvedAppConfig;
}

export const SignUpForm = ({ appConfig, className, ...props }: Readonly<Props>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setErrorMessage("");
    startTransition(async () => {
      try {
        const result = await createUser(data);

        if (!result.ok) {
          throw new Error(result.error || "Error durante el registro");
        }

        toast.success(result.message);

        const resultSignIn = await signIn("credentials", {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false,
        });

        if (resultSignIn?.error) {
          throw new Error(resultSignIn.error);
        }

        // Permitimos usar un callback URL si está disponible y es una URL segura.
        const isSafeUrl = callbackUrl.startsWith("/") && !callbackUrl.startsWith("//");
        let redirectTo = "/";
        if (appConfig.isEmailVerificationRequired) {
          redirectTo = `/auth/verify?callbackUrl=${encodeURIComponent(isSafeUrl ? callbackUrl : "/")}`;
        } else if (isSafeUrl) {
          redirectTo = callbackUrl;
        }

        router.push(redirectTo);
      } catch (error) {
        console.error("Error en el registro:", error);
        toast.error("Error durante el registro. Intenta más tarde.");
      }
    });
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>Elige un método de registro</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn("google", { callbackUrl })}
                  disabled={isPending}
                >
                  <FcGoogle />
                  Regístrate usando Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  O con credenciales
                </span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="tucorreo@ejemplo.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input placeholder="********" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <Input placeholder="********" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Registrando..." : "Registrarse"}
                  </Button>
                </form>
              </Form>
              {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/signin" className="underline underline-offset-4">
                  Iniciar sesión
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
