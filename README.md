# Plantilla inicial para proyectos de Next JS

## Descripción

Esta plantilla tiene todo lo necesario para iniciar un proyecto con las mejores practicas.

### Uso

Copia el repo

    gh repo clone jrfullstack/next-starter-app-jr
    cd next-starter-app-jr
    // Puedes cambiar el nombre del directorio y en el packege.json

Instala las dependencia

    npm install
    // o
    pnpm install
    // o cualquier otro

### Características

**Commitlint:** Para ordenar los commit por categorías - Puedes usar en Visual Studio Code el generador automático o esta pagina web: [Commitlint Generator](https://commitlint.io/)

**Change Logs Automatizados:** Para generar Release automatizadas con GitHub Actions - Para ello usamos el script `npm run release` y te saldrán las opciones. mas información sobre las SemVer en esta pagina: [Commitlint y SemVer](https://www.albertochamorro.dev/blog/conventional-commits-que-es/)
