"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { updateGeneralConfig } from "@/actions/config/update-general-config";
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

const INVALID_TYPE_ERROR = "Debe ser una cadena de texto";

const generalFormSchema = z.object({
  siteDisplayName: z
    .string({
      required_error: "El nombre del sitio es obligatorio",
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .min(1, "El nombre debe tener al menos un carácter"),
  siteUrl: z
    .string({
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .url()
    .transform((val) => val.trim())
    .refine((val) => !/\s/.test(val), {
      message: "La URL no debe contener espacios",
    })
    .refine((val) => val === "" || /^https?:\/\/.+\..+/.test(val), {
      message: "Debe ser una URL válida (http:// o https://)",
    }),
  isMaintenanceMode: z.boolean({
    required_error: "Debes indicar si el sitio está en mantenimiento",
  }),
  googleAnalyticsTrackingId: z
    .string({
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .optional()
    .or(z.literal("")),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

interface GeneralSettingsProps {
  siteDisplayName: string;
  siteUrl: string;
  logoUrl: string | null;
  isMaintenanceMode: boolean;
  googleAnalyticsTrackingId: string | null;
}

export const GeneralSettings = ({
  siteDisplayName,
  siteUrl,
  logoUrl,
  isMaintenanceMode,
  googleAnalyticsTrackingId,
}: GeneralSettingsProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(logoUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteDisplayName: siteDisplayName || "",
      siteUrl: siteUrl || "",
      isMaintenanceMode: isMaintenanceMode || false,
      googleAnalyticsTrackingId: googleAnalyticsTrackingId || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof generalFormSchema>) => {
    try {
      const formData = new FormData();
      formData.append("siteDisplayName", values.siteDisplayName);
      formData.append("siteUrl", values.siteUrl || "");
      formData.append("isMaintenanceMode", values.isMaintenanceMode.toString());
      formData.append("googleAnalyticsTrackingId", values.googleAnalyticsTrackingId || "");

      if (logoFile) {
        // Validar tamaño del archivo antes de enviar
        if (logoFile.size > 2 * 1024 * 1024) {
          toast.error("El logo no puede superar los 2MB");
          return;
        }
        formData.append("logo", logoFile);
      } else if (!logoPreview && logoUrl) {
        // Caso cuando se elimina el logo
        formData.append("logoUrl", "null");
      }

      const response = await updateGeneralConfig(formData);

      if (response.ok) {
        toast.success("Configuración general actualizada");
        // Resetear el estado del logo si se subió uno nuevo
        if (logoFile) {
          setLogoFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } else {
        toast.error(response.error || "Error al actualizar la configuración general");
      }
    } catch (error) {
      toast.error("Error inesperado al guardar la configuración general");
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten archivos de imagen");
        return;
      }

      // Validar tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo no puede superar los 2MB");
        return;
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
        <CardDescription>Configura los ajustes generales de la plataforma.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="siteDisplayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Plataforma</FormLabel>
                  <FormControl>
                    <Input placeholder="Mi Plataforma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Sitio</FormLabel>
                  <FormControl>
                    <Input placeholder="https://miplataforma.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Logo de la plataforma</FormLabel>
              <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
              <FormDescription>
                Sube una imagen para el logo (máx. 2MB). Formatos: JPG, PNG, WEBP.
              </FormDescription>

              {(logoPreview || logoUrl) && (
                <div className="relative mt-4 w-fit">
                  <Image
                    src={logoPreview || logoUrl || ""}
                    alt="Logo actual"
                    className="bg-muted h-20 w-auto rounded border p-2"
                    width={100}
                    height={100}
                  />
                  {logoFile && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                      onClick={removeLogo}
                    >
                      X
                    </Button>
                  )}
                </div>
              )}
            </FormItem>

            <FormField
              control={form.control}
              name="googleAnalyticsTrackingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Google Analytics</FormLabel>
                  <FormControl>
                    <Input placeholder="UA-123456789-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMaintenanceMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Modo Mantenimiento</FormLabel>
                    <FormDescription>
                      Activa para mostrar una página de mantenimiento a los usuarios.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
