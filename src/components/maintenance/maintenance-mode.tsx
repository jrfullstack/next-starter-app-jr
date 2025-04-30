export function MaintenanceMode({ platformName }: { readonly platformName: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">{platformName}</h1>
      <p className="text-muted-foreground text-xl">
        Estamos realizando tareas de mantenimiento. Por favor, vuelve pronto.
      </p>
    </div>
  );
}
