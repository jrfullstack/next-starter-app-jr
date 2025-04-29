import { ModeToggle } from "@/components";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-3xl">Bienvenido a mi plantilla para proyectos con NextJS</h1>

      <ModeToggle />
    </div>
  );
}
