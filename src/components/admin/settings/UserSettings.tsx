"use client";

// Añadir un estado de carga
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { updateUserConfig } from "@/actions/config/update-user-config";
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

const userFormSchema = z.object({
  isUserSignUpEnabled: z.boolean({
    required_error: "Debes indicar si el registro de usuarios está habilitado",
  }),
  maxActiveSessionsPerUser: z.coerce
    .number({
      required_error: "Debes indicar el número máximo de sesiones activas",
      invalid_type_error: "Debe ser un número",
    })
    .int("Debe ser un número entero")
    .min(1, "Debe permitir al menos 1 sesión activa")
    .max(10, "No puede permitir más de 10 sesiones activas"),
  isSingleUserPerIpEnforced: z.boolean({
    required_error: "Debes indicar si se restringe a un solo usuario por IP",
  }),
  isEmailVerificationRequired: z.boolean({
    required_error: "Debes indicar si se requiere verificación de email",
  }),
  isGlobalTwoFactorAuthEnabled: z.boolean({
    required_error: "Debes indicar si la autenticación 2FA está habilitada globalmente",
  }),
  sessionTimeoutLimitMinutes: z.coerce
    .number({
      required_error: "Debes indicar el tiempo de expiración de sesión en minutos",
      invalid_type_error: "Debe ser un número",
    })
    .int("Debe ser un número entero")
    .min(5, "El tiempo mínimo de expiración debe ser de 5 minutos")
    .max(10_080, "El tiempo máximo de expiración es de 10,080 minutos (7 Dias)"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserSettingsProps {
  isUserSignUpEnabled: boolean;
  maxActiveSessionsPerUser: number | null;
  isSingleUserPerIpEnforced: boolean;
  isEmailVerificationRequired: boolean;
  isGlobalTwoFactorAuthEnabled: boolean;
  sessionTimeoutLimitMinutes: number | null;
}

// Modificar el componente para manejar el estado de carga
export const UserSettings = ({
  isUserSignUpEnabled,
  maxActiveSessionsPerUser,
  isSingleUserPerIpEnforced,
  isEmailVerificationRequired,
  isGlobalTwoFactorAuthEnabled,
  sessionTimeoutLimitMinutes,
}: UserSettingsProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      isUserSignUpEnabled: isUserSignUpEnabled,
      maxActiveSessionsPerUser: maxActiveSessionsPerUser || 3,
      isSingleUserPerIpEnforced: isSingleUserPerIpEnforced,
      isEmailVerificationRequired: isEmailVerificationRequired,
      isGlobalTwoFactorAuthEnabled: isGlobalTwoFactorAuthEnabled || false,
      sessionTimeoutLimitMinutes: sessionTimeoutLimitMinutes || 30,
    },
  });

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    try {
      const formData = new FormData();
      formData.append("isUserSignUpEnabled", values.isUserSignUpEnabled.toString());
      formData.append("maxActiveSessionsPerUser", values.maxActiveSessionsPerUser.toString());
      formData.append("isSingleUserPerIpEnforced", values.isSingleUserPerIpEnforced.toString());
      formData.append("isEmailVerificationRequired", values.isEmailVerificationRequired.toString());

      formData.append(
        "isGlobalTwoFactorAuthEnabled",
        values.isGlobalTwoFactorAuthEnabled.toString(),
      );
      formData.append("sessionTimeoutLimitMinutes", values.sessionTimeoutLimitMinutes.toString());

      const response = await updateUserConfig(formData);

      if (response.ok) {
        toast.success("Configuración de usuarios actualizada");
      } else {
        toast.error(response.error || "Error al actualizar la configuración de usuarios");
      }
    } catch (error) {
      toast.error("Error inesperado al guardar la configuración de usuarios");
      console.error(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Usuarios</CardTitle>
        <CardDescription>Administra las políticas de usuarios y seguridad.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="isUserSignUpEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Permitir Registros</FormLabel>
                    <FormDescription>
                      Habilita o deshabilita el registro de nuevos usuarios.
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
              name="isEmailVerificationRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Verificación de Email</FormLabel>
                    <FormDescription>
                      Requiere que los usuarios verifiquen su dirección de correo electrónico.
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
              name="isGlobalTwoFactorAuthEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Autenticación de Dos Factores</FormLabel>
                    <FormDescription>
                      Habilita la autenticación de dos factores para todos los usuarios.
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
              name="isSingleUserPerIpEnforced"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Un Registro Usuario por IP</FormLabel>
                    <FormDescription>
                      Evita que múltiples usuarios se registren desde la misma dirección IP.
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
              name="maxActiveSessionsPerUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sesiones Activas Máximas</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número máximo de sesiones activas permitidas por usuario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionTimeoutLimitMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo de Expiración de Sesión (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tiempo en minutos antes de que una sesión inactiva expire.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
