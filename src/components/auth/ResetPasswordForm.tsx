"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { resetPassword } from "@/actions/auth/password-reset/reset-password";
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

const schema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La confirmación debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type SchemaFormData = z.infer<typeof schema>;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  token: string;
}

export const ResetPasswordForm = ({ token, className, ...props }: Readonly<Props>) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: SchemaFormData) => {
    if (!token) {
      toast.error("Token no válido");
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPassword({ token, password: data.password });

        if (!result.ok) {
          toast.error(result.error || "Error al restablecer la contraseña");
          throw new Error(result.error || "Error al restablecer la contraseña");
        }

        await signIn("credentials", {
          redirect: false,
          email: result.email,
          password: data.password,
        });

        toast.success("Contraseña actualizada correctamente");
        router.push("/");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    });
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Restablecer contraseña</CardTitle>
          <CardDescription>Ingresa tu nueva contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
