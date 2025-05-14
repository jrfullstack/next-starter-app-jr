import { execSync } from "child_process";

// Esta función se ejecutará con los archivos staged
// pero TypeScript necesita verificar todo el proyecto de todos modos
try {
  console.log("Running TypeScript check...");
  execSync("tsc --noEmit", { stdio: "inherit" });
  console.log("TypeScript check passed!");
} catch (error) {
  console.error("TypeScript check failed!");
  process.exit(1);
}
