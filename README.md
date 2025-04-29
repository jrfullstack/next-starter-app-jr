# Plantilla inicial para proyectos de Next JS

## Descripción

Esta plantilla tiene todo lo necesario para iniciar un proyecto con las mejores practicas.

## Uso

Copia el repo

    gh repo clone jrfullstack/next-starter-app-jr
    cd next-starter-app-jr
    // Puedes cambiar el nombre del directorio y en el package.json

Instala las dependencia

    npm install
    // o
    pnpm install
    // o cualquier otro

## Características

**Commitlint:** Para ordenar los commit por categorías - Puedes usar en Visual Studio Code el generador automático o esta pagina web: [Commitlint Generator](https://commitlint.io/)

**Change Logs Automatizados:** Para generar Release automatizadas con GitHub Actions - Para ello usamos el script `npm run release` y te saldrán las opciones. mas información sobre las SemVer en esta pagina: [Commitlint y SemVer](https://www.albertochamorro.dev/blog/conventional-commits-que-es/)

**Husky y GitHub Actions:** Para ejecutar acciones automáticamente antes de hacer los commit o push que hacemos a GitHub.

**Eslint y Prettier:** Para mostrar mensajes de errores en el editor y formateo.

## Scripts

    "preview": "next build && next start", // Previsualizar el Proyecto
    "lint": "eslint .", // Revisar los lint de todo el proyecto
    "lint:fix": "eslint --fix", // Corregir los lint automáticamente
    "format:check": "prettier --check \"**/*.{ts,tsx,mdx}\" --cache", // revisa el formato
    "format:write": "prettier --write \"**/*.{ts,tsx,mdx}\" --cache", # Corrige el formateo
    "typecheck": "tsc --noEmit", // Revisar los Tipos de todo el proyecto
    "check-all": "pnpm typecheck && pnpm lint && pnpm build", // Revision general del proyecto
    "fix-all": "npm run lint:fix && npm run format:write", // Corrige todo el proyecto
    "release": "bumpp --commit --push --tag", // Para crear nuevas release
    "prepare": "husky install" // Para cuando se instala el proyecto se ejecute la instalación husky y sus Actions
