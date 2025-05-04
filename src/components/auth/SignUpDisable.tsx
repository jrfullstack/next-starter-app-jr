import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  isEmailConfigured?: boolean;
  emailUser?: string | null;
}

export const SignUpDisable = ({ isEmailConfigured, emailUser }: Props) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>Registro Desactivado</CardTitle>
        </div>
        <CardDescription>Información importante para nuevos usuarios</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Lamentamos informarle que actualmente los registros para nuevos usuarios están
          temporalmente desactivados. Estamos realizando mejoras en nuestro sistema para brindarle
          una mejor experiencia.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button variant="outline" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>

        {isEmailConfigured ? (
          <Button asChild>
            <Link href="/contact">Contactar soporte</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`mailto:${emailUser}`} target="_blank" rel="noopener noreferrer">
              Contactar soporte
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
