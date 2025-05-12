import Link from "next/link";

export function Footer() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 z-20 w-full shadow backdrop-blur">
      <div className="mx-4 flex h-14 items-center md:mx-8">
        <p className="text-muted-foreground text-left text-xs leading-loose md:text-sm">
          Creado por{" "}
          <Link
            href="https://github.com/jrfullstack"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            JrFullStack
          </Link>
          . El código fuente está disponible en{" "}
          <Link
            href="https://github.com/jrfullstack/next-starter-app-jr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
