import Link from "next/link";
import { Clock, Settings, Wrench } from "lucide-react";

interface Props {
  contactEmail: string | null;
}
// que no tenga el layout o que tenga acceso a contacto
export function MaintenanceMode({ contactEmail }: Readonly<Props>) {
  return (
    <div className="from-background to-muted/30 min-h-screen bg-gradient-to-b">
      <main className="flex items-center justify-center">
        <section className="container flex flex-col items-center justify-center gap-6 py-8 md:py-12 lg:py-16">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            {/* Ilustración animada de mantenimiento */}
            <div className="relative mb-6 h-64 w-64 md:h-80 md:w-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-muted/50 h-full w-full rounded-full p-4"></div>
              </div>

              {/* Engranaje grande animado */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin-slow">
                  <Settings className="text-primary/80 h-32 w-32" strokeWidth={1.5} />
                </div>
              </div>

              {/* Engranaje pequeño animado */}
              <div className="absolute top-[30%] left-[65%] -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin-reverse">
                  <Settings className="text-primary/60 h-16 w-16" strokeWidth={1.5} />
                </div>
              </div>

              {/* Llave inglesa animada */}
              <div className="absolute top-[65%] left-[35%] -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin-slow">
                  <Wrench className="text-primary/70 h-20 w-20" strokeWidth={1.5} />
                </div>
              </div>

              {/* Reloj animado */}
              <div className="absolute top-[30%] left-[25%] -translate-x-1/2 -translate-y-1/2">
                <div className="animate-pulse">
                  <Clock className="text-primary/50 h-14 w-14" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl leading-tight font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Estamos en mantenimiento
            </h1>

            <p className="text-muted-foreground max-w-[700px] md:text-xl">
              Estamos realizando mejoras en nuestro sitio. Volveremos pronto con una experiencia
              mejorada.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md space-y-8">
            {/* Recolección de email para aviso de regreso*/}
            {/* <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                ¿Quieres recibir una notificación cuando volvamos?
              </h2>
              <div className="flex w-full items-center space-x-2">
                <Input type="email" placeholder="tu@email.com" className="h-11" />
                <Button type="submit" size="icon" className="h-11 w-11">
                  <ArrowRight className="h-5 w-5" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </div>
            </div> */}
            {contactEmail && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Contáctanos</h2>
                <p className="text-muted-foreground">
                  Para cualquier consulta, escríbenos a{" "}
                  <Link
                    href={`mailto:${contactEmail}`}
                    className="text-primary font-medium underline underline-offset-4"
                  >
                    {contactEmail}
                  </Link>
                </p>
              </div>
            )}
            {/* Redes Sociales */}
            {/* <div className="space-y-2">
              <h2 className="text-xl font-semibold">Síguenos</h2>
              <div className="flex items-center justify-center space-x-4">
                <Link
                  href={twitterHref}
                  className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 1200 1227"
                  >
                    <path
                      fill="#fff"
                      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                    />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href={instagramHref}
                  className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#fff"
                      d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z"
                    />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href={linkedInHref}
                  className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
                      fill="#0A66C2"
                    />
                  </svg>

                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href={facebookHref}
                  className="bg-muted hover:bg-muted/80 rounded-full p-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 36 36"
                    fill="url(#a)"
                    height="20"
                    width="20"
                  >
                    <defs>
                      <linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="a">
                        <stop offset="0%" stopColor="#0062E0" />
                        <stop offset="100%" stopColor="#19AFFF" />
                      </linearGradient>
                    </defs>
                    <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
                    <path
                      fill="#FFF"
                      d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
                    />
                  </svg>

                  <span className="sr-only">Facebook</span>
                </Link>
              </div>
            </div> */}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="relative flex h-3 w-3">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-3 w-3 rounded-full"></span>
            </div>
            <p className="text-muted-foreground ml-2 text-sm">
              Trabajando en las mejoras... Volveremos pronto
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
