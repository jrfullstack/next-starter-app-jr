import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import unicornPlugin from "eslint-plugin-unicorn"; // genera el warning node:25684
import securityPlugin from "eslint-plugin-security";
import promisePlugin from "eslint-plugin-promise";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import functionalPlugin from "eslint-plugin-functional";
import pluginComments from "eslint-plugin-eslint-comments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  {
    ignores: [
      "dist",
      "node_modules",
      ".husky",
      ".vscode",
      ".next",
      ".github",
      "public",
      "prisma",
      "src/app/generated",
      "tools",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      unicorn: unicornPlugin,
      security: securityPlugin,
      promise: promisePlugin,
      sonarjs: sonarjsPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      functional: functionalPlugin,
      "eslint-comments": pluginComments,
    },
    rules: {
      // Base: Controla el uso de console.log para evitar el exceso de logs en producción
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // --- Prettier ---
      ...prettierPlugin.configs.recommended.rules,
      "prettier/prettier": "error", // Exige el cumplimiento de reglas de formato de código de Prettier

      // --- React ---
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Desactivada porque Next.js no necesita importar React
      "react/jsx-uses-react": "error", // Asegura que se usa React en los archivos JSX
      "react/jsx-uses-vars": "error", // Asegura que las variables utilizadas en JSX se marquen correctamente
      "react/prop-types": "off", // Desactivado porque se usa TypeScript para los tipos
      "react/display-name": "warn", // Muestra una advertencia si el displayName no está presente

      // --- React Hooks ---
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error", // Asegura que los hooks se usen correctamente
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "(useCustomHook|useOtherHook)", // Permite hooks personalizados
        },
      ],

      // --- Import ---
      ...importPlugin.configs.recommended.rules,
      "import/extensions": ["error", "never"], // No requiere especificar extensiones de archivo
      "import/no-unresolved": "error", // Evita imports no resueltos
      "import/named": "error", // Exige que las exportaciones nombradas sean válidas
      "import/no-cycle": "warn", // Muestra advertencia sobre dependencias cíclicas
      "import/no-useless-path-segments": "warn", // Muestra advertencia si se usan segmentos de rutas inútiles
      "import/no-anonymous-default-export": "error", // Evita exportaciones anónimas por defecto
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"], // Exige un estilo consistente de tipos

      // --- JSX Accessibility ---
      ...jsxA11yPlugin.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["noHref", "invalidHref", "preferButton"], // Requiere enlaces válidos en los elementos Anchor
        },
      ],
      "jsx-a11y/alt-text": "warn", // Asegura que las imágenes tengan texto alternativo
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          assert: "either",
          depth: 3,
        },
      ], // Requiere etiquetas asociadas a controles de formularios

      // --- Unicorn Rules ---
      ...unicornPlugin.configs.recommended.rules,
      "unicorn/prevent-abbreviations": "off", // Permite abreviaturas (para flexibilidad en proyectos reales)
      "unicorn/no-null": "off", // Permite el uso de null
      "unicorn/prefer-node-protocol": "off", // Exige el uso de 'node' en los imports relacionados con el protocolo
      "unicorn/prefer-ternary": "warn", // Recomienda el uso de ternarios en lugar de if-else
      "unicorn/consistent-function-scoping": "off", // Desactivada debido a las particularidades de React
      "unicorn/no-json-parse": "off",
      "unicorn/no-useless-undefined": ["error", { checkArguments: false }], // Evita el uso innecesario de undefined
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ], // Exige el uso de kebab-case o pascal-case para los nombres de archivos

      // --- Security Rules ---
      ...securityPlugin.configs.recommended.rules,
      "security/detect-buffer-noassert": "error", // Asegura que los buffers no usen "noAssert"
      "security/detect-disable-mustache-escape": "error", // Evita deshabilitar el escape de mustache
      "security/detect-eval-with-expression": "error", // Evita el uso de eval con expresiones
      "security/detect-new-buffer": "error", // Evita la creación de nuevos buffers
      "security/detect-no-csrf-before-method-override": "error", // Requiere protección CSRF
      "security/detect-non-literal-fs-filename": "warn", // Muestra advertencias sobre nombres de archivos no literales
      "security/detect-object-injection": "warn", // Muestra advertencia sobre posibles inyecciones de objetos

      // --- Promise Rules ---
      ...promisePlugin.configs.recommended.rules,
      "promise/always-return": "error", // Exige que las promesas siempre devuelvan un valor
      "promise/no-return-wrap": "error", // Evita envolver valores devueltos en promesas
      "promise/param-names": "error", // Asegura que los nombres de parámetros en promesas sean coherentes
      "promise/no-nesting": "warn", // Muestra advertencia sobre promesas anidadas
      "promise/prefer-await-to-then": "warn", // Prefiere el uso de await en lugar de then
      "promise/no-multiple-resolved": "error", // Evita que se resuelvan promesas múltiples veces

      // --- TypeScript Rules ---
      ...typescriptEslintPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ], // Asegura que las variables no usadas se marquen
      "@typescript-eslint/no-explicit-any": "warn", // Recomienda evitar el uso de 'any'
      "@typescript-eslint/no-floating-promises": "error", // Evita promesas flotantes
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ], // Exige un estilo consistente de importación de tipos

      // --- Import Sorting Rules ---
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^next", "^@?\\w"], // Ordena las importaciones de React, Next y otras dependencias
            ["^@(/.*|$)"], // Ordena las importaciones que empiezan con '@'
            ["^\\u0000"], // Ordena las importaciones de módulos internos
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // Ordena las importaciones relativas a directorios padres
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // Ordena las importaciones relativas dentro de carpetas
            ["^.+\\.s?css$"], // Ordena las importaciones de archivos CSS/SCSS
          ],
        },
      ],
      "simple-import-sort/exports": "error", // Exige un orden consistente en las exportaciones

      // --- Functional Programming Rules ---
      "functional/no-let": "off", // Permite el uso de 'let' en React (para mayor flexibilidad)
      "functional/no-mixed-types": "off", // Muestra advertencia si se mezclan tipos en funciones
      "functional/prefer-readonly-type": "off", // evita que todos tipos sean solo lectura
      "functional/no-return-void": "off", // Permite el uso de return void en React

      // --- SonarJS Rules ---
      ...sonarjsPlugin.configs.recommended.rules,
      "sonarjs/no-unused-vars": "off", // desactivado porque ya está activado en typescript
      "sonarjs/no-dead-store": "off", // desactivado porque ya está activado en typescript
      "sonarjs/no-duplicate-string": "off", // Muestra advertencia sobre cadenas duplicadas
      "sonarjs/no-identical-conditions": "error", // Exige que no haya condiciones idénticas
      "sonarjs/no-collapsible-if": "error", // Evita bloques if que se puedan combinar
      "sonarjs/no-redundant-boolean": "error", // Evita el uso de booleanos redundantes
      "sonarjs/no-small-switch": "warn", // Muestra advertencia sobre switch con pocos casos
      "sonarjs/no-unused-collection": "warn", // Muestra advertencia sobre colecciones no utilizadas

      // --- Additional Rules ---
      "prefer-arrow-callback": "error", // Exige el uso de funciones flecha en callbacks
      "no-useless-constructor": "error", // Elimina los constructores innecesarios

      // Comment Rules
      ...pluginComments.configs.recommended.rules,
      "eslint-comments/no-unused-disable": "error", // importante para reportar disables no usados
      "eslint-comments/no-unlimited-disable": "error",
      "eslint-comments/no-duplicate-disable": "error",
    },
  },

  // --- Next.js specific (incluye Core Web Vitals y TypeScript rules) ---
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "plugin:prettier/recommended"],
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
  }),
];

export default eslintConfig;
