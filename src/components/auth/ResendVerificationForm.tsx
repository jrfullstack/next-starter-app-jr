"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { resendVerificationEmail } from "@/actions/auth/email-verify/resend-verification-email";
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

export const ResendVerificationForm = ({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SchemaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: session?.user.email || "",
    },
  });

  useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session.user.email);
    }
  }, [session, form]);

  const handleResend = async (data: SchemaFormData) => {
    startTransition(async () => {
      const result = await resendVerificationEmail(data.email);

      if (result?.ok) {
        toast.success("Hemos reenviado el correo de verificación.");
        router.push("/auth/verify");
      } else {
        toast.error(
          "error" in result ? result.error : result?.message || "No se pudo reenviar el email.",
        );
      }
    });
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reenviar código de verificación</CardTitle>
          <CardDescription>
            Si no recibiste el correo, puedes solicitar que te lo reenviemos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResend)} className="grid gap-6">
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Enviando..." : "Reenviar código"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
