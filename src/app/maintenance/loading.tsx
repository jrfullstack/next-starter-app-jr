import { Skeleton } from "../../components/ui/skeleton";

export default function Loading() {
  return (
    <div className="from-background to-muted/30 min-h-screen bg-gradient-to-b">
      <main className="flex items-center justify-center">
        <section className="container flex flex-col items-center justify-center gap-6 py-8 md:py-12 lg:py-16">
          <Skeleton className="mb-10 h-64 w-64 rounded-full md:h-80 md:w-80" />
          <Skeleton className="h-15 w-[300px] rounded-md md:w-[500px]" />
          <Skeleton className="h-6 w-[400px] rounded-md" />
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-6 w-[200px] rounded-md" />
            <Skeleton className="h-5 w-[300px] rounded-md" />
          </div>
        </section>
      </main>
    </div>
  );
}
