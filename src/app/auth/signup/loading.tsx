import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 self-center">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Card (registro) */}
        <div className="flex flex-col gap-6">
          <div className="bg-card text-card-foreground gap-4 rounded-lg border shadow-sm">
            <div className="space-y-1 p-6 text-center">
              <Skeleton className="mx-auto h-6 w-32" />
              <Skeleton className="mx-auto h-4 w-40" />
            </div>
            <span className="text-muted-foreground relative z-10 px-2">
              <Skeleton className="mx-auto h-4 w-40" />
            </span>
            <div className="space-y-4 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="mx-auto h-4 w-48" />
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="text-muted-foreground text-center text-xs">
            <Skeleton className="mx-auto h-3 w-64" />
          </div>
        </div>
      </div>
    </main>
  );
}
