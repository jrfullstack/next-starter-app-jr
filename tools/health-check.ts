import { execSync } from "node:child_process";
import { performance } from "node:perf_hooks";

function runCommand(command: string, description: string) {
  console.log(`\n🔎 ${description}...`);
  try {
    const output = execSync(command, { stdio: "inherit" });
    return output;
  } catch {
    console.error(`❌ Error while running: ${command}`);
  }
}

function measureInstallTime() {
  const start = performance.now();
  runCommand("npm install", "Installing dependencies");
  const end = performance.now();
  const installTime = ((end - start) / 1000).toFixed(2); // Time in seconds
  console.log(`\n🕒 Installation completed in ${installTime} seconds.\n`);
}

function getProjectSize() {
  console.log("\n📦 Checking project size...");
  try {
    const isWindows = process.platform === "win32";
    let sizeOutput;

    // En Windows, usaremos PowerShell para calcular el tamaño correctamente
    if (isWindows) {
      const sizeCommand =
        "powershell -Command \"$size = (Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB; $size.ToString('F2', [System.Globalization.CultureInfo]::InvariantCulture)\"";

      sizeOutput = execSync(sizeCommand, { stdio: "pipe" }).toString().trim();
    } else {
      // Para sistemas Unix/Linux
      const sizeCommand = "du -sh node_modules";
      sizeOutput = execSync(sizeCommand, { stdio: "pipe" }).toString().trim();
    }

    // Convertir a número para validar (sólo en Windows donde devolvemos directamente un número)
    if (isWindows) {
      const sizeNumber = Number.parseFloat(sizeOutput);
      if (Number.isNaN(sizeNumber) || sizeNumber > 10_000) {
        console.log("❌ Error while calculating project size: Invalid output.");
      } else {
        console.log(`📦 Total project size: ${sizeNumber.toFixed(2)} MB`);
      }
    } else {
      console.log(`📦 Total project size: ${sizeOutput}`);
    }
  } catch (error) {
    console.error("❌ Error while calculating project size:", (error as Error).message);
  }
}

function main() {
  console.log("🚑 Project Health Check Starting...\n");

  measureInstallTime(); // Install dependencies and measure time
  getProjectSize(); // Show project size

  runCommand("npm outdated", "Checking outdated packages");
  runCommand("npm audit", "Running security audit");

  console.log("\n✅ Health Check Completed!\n");
}

main();
