"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { updateSeoConfig } from "@/actions/config/update-seo-config";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const INVALID_TYPE_ERROR = "Debe ser una cadena de texto";

const seoFormSchema = z.object({
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
  siteDescription: z
    .string({
      required_error: "La descripción del sitio es obligatoria",
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .min(5, "La descripción debe tener al menos un carácter")
    .max(255, "La descripción no puede exceder los 255 caracteres"),
  defaultLocale: z
    .string({
      required_error: "El lenguaje del sitio es obligatorio",
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .min(2)
    .max(5),
  isSiteNoIndexEnabled: z.boolean({
    required_error: "Debes indicar que los motores de búsqueda puedan o no indexar el sitio",
  }),
  seoDefaultKeywords: z
    .string()
    .min(1)
    .max(255, "Las palabras clave no pueden exceder los 255 caracteres"),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

interface SeoSettingsProps {
  siteDisplayName: string;
  siteUrl: string;
  siteDescription: string;
  faviconUrl: string | null;
  defaultLocale: string;
  isSiteNoIndexEnabled: boolean;
  seoDefaultKeywords: string | string[];
}

// Modificar el componente para manejar el estado de carga
export const SeoSettings = ({
  siteDisplayName,
  siteUrl,
  siteDescription,
  faviconUrl,
  defaultLocale,
  isSiteNoIndexEnabled,
  seoDefaultKeywords,
}: SeoSettingsProps) => {
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(faviconUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      siteDisplayName: siteDisplayName ?? "",
      siteUrl: siteUrl ?? "",
      siteDescription: siteDescription ?? "",
      defaultLocale: defaultLocale ?? "es",
      isSiteNoIndexEnabled: isSiteNoIndexEnabled || true,
      seoDefaultKeywords: Array.isArray(seoDefaultKeywords)
        ? seoDefaultKeywords.join(", ")
        : (seoDefaultKeywords ?? ""), // Maneja ambos casos (array o string)
    },
  });

  async function onSubmit(values: z.infer<typeof seoFormSchema>) {
    try {
      const formData = new FormData();
      formData.append("siteDisplayName", values.siteDisplayName);
      formData.append("siteUrl", values.siteUrl || "");
      formData.append("siteDescription", values.siteDescription);
      formData.append("defaultLocale", values.defaultLocale);
      formData.append("isSiteNoIndexEnabled", values.isSiteNoIndexEnabled.toString());
      formData.append("seoDefaultKeywords", values.seoDefaultKeywords || "");

      if (faviconFile) {
        // Validar tamaño del archivo antes de enviar
        if (faviconFile.size > 2 * 1024 * 1024) {
          toast.error("El favicon no puede superar los 2MB");
          return;
        }
        formData.append("favicon", faviconFile);
      } else if (!faviconPreview && faviconUrl) {
        // Caso cuando se elimina el logo
        formData.append("faviconUrl", "null");
      }

      const response = await updateSeoConfig(formData);

      if (response.ok) {
        toast.success("Configuración SEO actualizada correctamente");
        // Resetear el estado del logo si se subió uno nuevo
        if (faviconFile) {
          setFaviconFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } else {
        toast.error("Error al actualizar la configuración SEO");
      }
    } catch (error) {
      toast.error("Error inesperado al guardar la configuración SEO");
      console.error(error);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo o icon
      const validTypes = ["image/png", "image/jpeg", "image/webp", "image/x-icon"];
      if (!validTypes.includes(file.type)) {
        toast.error("Solo se permiten archivos .png, .jpg, .webp, .ico");
        return;
      }

      // Validar tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo no puede superar los 2MB");
        return;
      }

      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const removeFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración SEO</CardTitle>
        <CardDescription>Administra la configuración SEO global de la plataforma.</CardDescription>
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
                  <FormDescription>
                    Nombre que se mostrará en el título de las páginas.
                  </FormDescription>
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
                  <FormDescription>URL principal de la plataforma.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Sitio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Una plataforma increíble para usuarios increíbles"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descripción que aparecerá en los resultados de búsqueda.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Favicon</FormLabel>
              <Input
                type="file"
                accept=".ico,.png,.jpg,.jpeg,.webp"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <FormDescription>
                Sube una imagen para el favicon (máx. 2MB). Formatos: JPG, PNG, WEBP, ICO.
              </FormDescription>
              <FormMessage />

              {(faviconPreview || faviconUrl) && (
                <div className="relative mt-4 w-fit">
                  <Image
                    src={faviconPreview || faviconUrl || ""}
                    alt="favicon actual"
                    className="bg-muted h-20 w-auto rounded border p-2"
                    width={100}
                    height={100}
                  />
                  {faviconFile && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                      onClick={removeFavicon}
                    >
                      X
                    </Button>
                  )}
                </div>
              )}
            </FormItem>

            <FormField
              control={form.control}
              name="defaultLocale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idioma Predeterminado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un idioma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en" disabled>
                        English
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Idioma predeterminado para el sitio.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSiteNoIndexEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">No Indexar Sitio</FormLabel>
                    <FormDescription>
                      Evita que los motores de búsqueda indexen el sitio.
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
              name="seoDefaultKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palabras Clave</FormLabel>
                  <FormControl>
                    <Textarea placeholder="plataforma, web, aplicación" {...field} />
                  </FormControl>
                  <FormDescription>Separadas por coma para mejorar el SEO.</FormDescription>
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
