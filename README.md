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

### 🧠 Opciones de Configuración del Administrador

El sistema permite configurar distintos aspectos globales de la aplicación desde un panel de administración central. A continuación se detallan las opciones disponibles:

#### 🔧 General

- **Correo de contacto**: Dirección de email visible para usuarios o para fines administrativos.
- **Logo del sitio**: URL del logotipo usado en la interfaz pública.
- **Modo mantenimiento**: Permite desactivar temporalmente el sitio para todos los usuarios excepto administradores.
- **Google Analytics ID**: Código de seguimiento de Google Analytics (opcional).

#### 👤 Configuración de Usuarios

- **Registro habilitado**: Permite activar o desactivar el registro de nuevos usuarios.
- **Máximo de sesiones por usuario**: Límite de sesiones activas simultáneas por cuenta.
- **Un usuario por IP**: Impide múltiples cuentas conectándose desde la misma IP.
- **Requiere verificación por email**: Exige confirmación por correo al registrarse.
- **Autenticación 2FA global**: Habilita verificación en dos pasos para todos los usuarios.
- **Tiempo máximo de sesión (minutos)**: Tiempo límite de inactividad antes de cerrar sesión automáticamente.

#### 🌐 Configuración Global de SEO

- **Nombre del sitio**: Nombre que se muestra en buscadores y pestañas.
- **URL del sitio**: Dirección principal del dominio del proyecto.
- **Descripción del sitio**: Descripción corta para propósitos de SEO.
- **Favicon**: URL del ícono del sitio.
- **Idioma por defecto**: Localización predeterminada (por ejemplo, `es`, `en`).
- **Evitar indexación**: Activa `noindex` global para evitar que el sitio aparezca en buscadores.
- **Palabras clave SEO por defecto**: Lista de keywords separadas por coma para SEO global.

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
