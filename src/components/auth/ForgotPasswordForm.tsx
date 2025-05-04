"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { sendPasswordResetEmail } from "@/actions/auth/password-reset/send-password-reset-email";
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
  email: z.string().email("El correo no es válido"),
});

type SchemaFormData = z.infer<typeof schema>;

export const ForgotPasswordForm = ({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: SchemaFormData) => {
    startTransition(async () => {
      try {
        const result = await sendPasswordResetEmail({ emailTo: data.email });

        if (!result.ok) {
          throw new Error(result.message || "Error al enviar el correo");
        }

        toast.success(
          "Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.",
          { duration: 5000 },
        );
        // mandarlo a una pagina o abrir un dialog y/o luego enviarlo a signin
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
          <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu
            contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tucorreo@ejemplo.com"
                        type="email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
                {isPending ? "Enviando..." : "Enviar instrucciones"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
