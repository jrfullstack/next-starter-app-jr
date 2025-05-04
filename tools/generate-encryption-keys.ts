import crypto from "crypto";

// Función para generar claves seguras
function generateEncryptionKeys() {
  // Generar clave de cifrado (32 bytes = 256 bits para AES-256)
  const key = crypto.randomBytes(32).toString("hex");

  return { key };
}

// Generar las claves
const { key } = generateEncryptionKeys();

// Mostrar los resultados listos para copiar al .env
console.log("Copia estos valores a tu archivo .env:\n");
console.log(`ENCRYPTION_KEY="${key}"`);

// Ejemplo de cómo se usarían (opcional)
console.log("\nEjemplo de uso:");
const testText = "contraseña-secreta-smtp";
console.log("Texto original:", testText);
