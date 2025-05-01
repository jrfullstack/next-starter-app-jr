# 🚀 Next.js Starter Template

Plantilla inicial lista para producción y altamente configurable, ideal para iniciar proyectos con **Next.js**, **Prisma**, y las mejores prácticas modernas.

---

## 📦 Instalación

Clona el repositorio y entra al directorio:

```bash
gh repo clone jrfullstack/next-starter-app-jr
cd next-starter-app-jr
```

Opcional: cambia el nombre del directorio y actualiza el `package.json`.

Instala las dependencias:

```bash
npm install
# o
pnpm install
# o
yarn install
```

Ejecuta el seed inicial:

```bash
npm run seed
```

---

## ⚙️ Características

- ✅ **Commitlint**: Estandariza tus commits con categorías.

  - Usa [Commitlint Generator](https://commitlint.io/) o el generador de VS Code.

- ✅ **Changelog Automático**: Crea versiones automáticamente con GitHub Actions.

  - Ejecuta `npm run release`. Más info sobre [Conventional Commits y SemVer](https://www.albertochamorro.dev/blog/conventional-commits-que-es/).

- ✅ **Husky + GitHub Actions**: Acciones automáticas al hacer `commit` o `push`.
- ✅ **Eslint + Prettier**: Linting y formateo automático del código.
- ✅ **Prisma ORM**: Mapeo objeto-relacional listo para producción.
- ✅ **Panel de Configuración (AppConfig)**:

  - 🔧 Modo mantenimiento para admins.
  - 🔍 Control de indexación para buscadores.
  - 📈 Google Analytics Tracking ID.
  - ⚙️ Nombre del sitio, descripción, URL, favicon, logo, email, locales, etc.
  - 🧑‍💻 Registro de usuarios, sesiones activas, IP únicas, verificación de email, 2FA global.
  - 🧠 Configuración SEO global con palabras clave y control de robots.

---

## 🧪 Scripts

```json
"scripts": {
  // Inicia el servidor de desarrollo con Turbopack y genera el cliente Prisma
  "dev": "npm run prisma:generate && next dev --turbopack",
  // Inicia el servidor de desarrollo con variables de entorno de producción
  "dev:prodenv": "dotenv -e .env.production -- next dev --turbopack",
  // Ejecuta migraciones y compila la aplicación Next.js para producción
  "build": "npm run prisma:deploy && next build",
  // Inicia la aplicación Next.js en modo producción
  "start": "next start",
  // Compila y ejecuta la app para previsualización como si fuera producción
  "preview": "next build && next start",
  // Ejecuta ESLint para detectar problemas de estilo o errores
  "lint": "eslint .",
  // Ejecuta ESLint y corrige automáticamente los errores posibles
  "lint:fix": "eslint --fix",
  // Verifica si los archivos están correctamente formateados con Prettier
  "format:check": "prettier --check \"**/*.{ts,tsx,mdx}\" --cache",
  // Formatea automáticamente los archivos con Prettier
  "format:write": "prettier --write \"**/*.{ts,tsx,mdx}\" --cache",
  // Revisa los tipos TypeScript sin generar archivos
  "typecheck": "tsc --noEmit",
  // Revisa tipos, linter y compila el proyecto (verificación completa)
  "check-all": "npm run typecheck && npm run lint && npm run build",
  // Aplica correcciones de estilo y formateo automáticamente
  "fix-all": "npm run lint:fix && npm run format:write",
  // Ejecuta un script personalizado para verificar el estado general del proyecto
  "health": "tsx ./tools/health-check.ts",
  // Realiza un release automático con commit, push y tag usando bumpp
  "release": "bumpp --commit --push --tag",
  // Genera el cliente de Prisma a partir del esquema actual
  "prisma:generate": "npx prisma generate",
  // Aplica las migraciones en producción y genera el cliente Prisma
  "prisma:deploy": "npx prisma migrate deploy && npm run prisma:generate",
  // Ejecuta migraciones en desarrollo
  "prisma:migrate": "npx prisma migrate dev",
  // Ejecuta el script de seed (carga de datos de prueba)
  "seed": "tsx ./prisma/seed/seed.ts",
  // Ejecuta el seed con variables de entorno de producción
  "seed:prod": "dotenv -e .env.production -- tsx ./prisma/seed/seed.ts",
  // Inicializa Husky para hooks de Git
  "prepare": "husky || true"
}
```

---

## 🧠 Modelo de configuración (`AppConfig`)

```prisma
model AppConfig {
  id Int @id @default(1) @map("_id")

  // General
  contactEmail              String?
  logoUrl                   String? @db.VarChar(255)
  isMaintenanceMode         Boolean @default(false)
  googleAnalyticsTrackingId String?

  // Usuario
  isUserSignUpEnabled          Boolean @default(true)
  maxActiveSessionsPerUser     Int?    @default(3)
  isSingleUserPerIpEnforced    Boolean @default(false)
  isEmailVerificationRequired  Boolean @default(true)
  isGlobalTwoFactorAuthEnabled Boolean @default(false)
  sessionTimeoutLimitMinutes   Int?    @default(30)

  // SEO Global
  siteDisplayName      String?
  siteUrl              String?
  siteDescription      String? @db.VarChar(255)
  faviconUrl           String? @db.VarChar(255)
  defaultLocale        String  @default("es")
  isSiteNoIndexEnabled Boolean @default(false)
  seoDefaultKeywords   String? @db.VarChar(255)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 💡 Recomendaciones

- Usa `core.autocrlf=false` y `.gitattributes` con `* text eol=lf` para evitar problemas de line endings en Windows.
- Añade soporte multilenguaje con i18n desde el inicio si planeas internacionalizar tu app.
- Considera usar herramientas como [Coolify](https://coolify.io/) o Vercel para despliegues rápidos y sencillos.

---

## ✨ Autor

**Jimmy Reyes (@jrfullstack)**
DJ y desarrollador fullstack.
[Mi Portafolio](https://jrfullstack.vercel.app/)
