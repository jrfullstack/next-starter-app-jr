"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { verifyToken } from "@/actions/auth/verify-token";
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

const schema = z.object({
  code: z.string().min(6, "El código debe tener al menos 6 caracteres"),
});

type SchemaFormData = z.infer<typeof schema>;

export const VerifyUserForm = ({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const hasHandledRef = useRef(false);
  const { update, status, data: session } = useSession();
  const userId = session?.user.id;

  const [isPending, startTransition] = useTransition();

  const form = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  const code = form.watch("code");
  const isButtonDisabled = isPending || code.trim().length !== 6;

  const handleVerify = useCallback(
    async (codeToVerify?: string) => {
      const token = codeToVerify || form.getValues("code").trim();
      if (!token) {
        toast.error("El código no puede estar vacío.");
        return;
      }

      startTransition(async () => {
        try {
          const result = await verifyToken(token);

          if (result?.ok && result.userEmailVerify) {
            toast.success("¡Email verificado correctamente!");

            if (status === "authenticated") {
              await update({
                user: { emailVerified: result.userEmailVerify },
              });
              router.push(callbackUrl);
            } else {
              router.push("/auth/signin");
            }
          } else {
            toast.error(result?.error || "Código inválido o expirado.");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
          toast.error(message);
        }
      });
    },
    [form, router, status, update, callbackUrl],
  );

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl && !hasHandledRef.current && status !== "loading") {
      hasHandledRef.current = true;
      form.setValue("code", tokenFromUrl);
      void handleVerify(tokenFromUrl);
    }
  }, [handleVerify, searchParams, status, form]);

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verifica tu cuenta</CardTitle>
          <CardDescription>
            Hemos enviado un código a tu correo. Ingresa el código para completar la verificación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => handleVerify())} className="grid gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de verificación</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa el código (ej. 123456)"
                        maxLength={6}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isButtonDisabled}>
                {isPending ? "Verificando..." : "Verificar"}
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿No recibiste el código?{" "}
            <a href="/auth/verify/resend" className="text-blue-500 underline">
              Reenviar email
            </a>
          </p>
          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿Quieres cambiar tu correo?{" "}
            <a href={`/user/${userId}/settings`} className="text-blue-500 underline">
              Panel de control
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
