"use client";

// Añadir un estado de carga
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, TestTube } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { updateSmtpConfig } from "@/actions/config/update-smtp-config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const smtpFormSchema = z.object({
  emailHost: z.string().min(1, "El host es requerido"),
  emailPort: z.coerce.number().int().min(1).max(65_535),
  emailUser: z.string().email("Debe ser un correo electrónico válido"),
  emailPassEnc: z.string().optional().or(z.literal("")),
  isEmailConfigured: z.boolean(),
});

type SmtpFormValues = z.infer<typeof smtpFormSchema>;

interface SmtpSettingsProps {
  emailHost: string | null;
  emailPort: number | null;
  emailUser: string | null;
  isEmailConfigured: boolean;
}

// Modificar el componente para manejar el estado de carga
export const SmtpSettings = ({
  emailHost,
  emailPort,
  emailUser,
  isEmailConfigured,
}: SmtpSettingsProps) => {
  const [isTesting, setIsTesting] = useState(false);
  const form = useForm<SmtpFormValues>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues: {
      emailHost: emailHost || "",
      emailPort: emailPort || 587,
      emailUser: emailUser || "",
      emailPassEnc: "",
      isEmailConfigured: isEmailConfigured || false,
    },
  });

  async function onSubmit(values: z.infer<typeof smtpFormSchema>) {
    try {
      const formData = new FormData();
      formData.append("emailHost", values.emailHost ?? "");
      formData.append("emailPort", values.emailPort?.toString() ?? "");
      formData.append("emailUser", values.emailUser ?? "");
      formData.append("isEmailConfigured", values.isEmailConfigured.toString());
      formData.append("emailPassEnc", values.emailPassEnc || "");

      const response = await updateSmtpConfig(formData);

      if (response.ok) {
        toast.success("Configuración smtp actualizada");
      } else {
        toast.error(response.error || "Error al actualizar la configuración smtp");
      }
    } catch (error) {
      toast.error("Error inesperado al guardar la configuración smtp");
      console.error(error);
    }
  }

  async function testSmtpConnection() {
    const values = form.getValues();

    if (!values.emailHost || !values.emailPort || !values.emailUser) {
      toast.error("Debes completar host, puerto y usuario.");
      return;
    }

    try {
      setIsTesting(true);
      const response = await fetch("/api/verify-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: values.emailHost,
          port: values.emailPort,
          secure: values.emailPort === 465, // ajuste simple
          user: values.emailUser,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Conexión SMTP exitosa.");
      } else {
        toast.error(data.message || "Error en la conexión SMTP.");
      }
    } catch (error) {
      toast.error("Error inesperado al verificar SMTP.");
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración SMTP</CardTitle>
        <CardDescription>
          Configura el servidor SMTP para el envío de correos electrónicos.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="isEmailConfigured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Configuración Activa</FormLabel>
                    <FormDescription>
                      Indica si la configuración SMTP está lista para usar.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailHost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="smtp.example.com" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Dirección del servidor SMTP.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puerto SMTP</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="587" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>
                    Puerto del servidor SMTP (normalmente 25, 465 o 587).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="soporte@example.com" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Correo electrónico de soporte o contacto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailPassEnc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña SMTP</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>Contraseña para la autenticación SMTP.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={testSmtpConnection}
              disabled={isTesting || !form.watch("emailPassEnc")}
              title={form.watch("emailPassEnc") ? "" : "Ingrese la contraseña para probar"}
            >
              <TestTube className="mr-2 h-4 w-4" />
              {isTesting ? "Probando conexión..." : "Probar conexión"}
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
