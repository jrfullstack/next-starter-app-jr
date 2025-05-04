import crypto from "crypto";

const algorithm = "aes-256-ctr";
const secret = process.env.ENCRYPTION_KEY!; // Debe ser de 32 bytes

// Convierte la clave hexadecimal en un buffer de 32 bytes
const key = Buffer.from(secret, "hex");

if (key.length !== 32) {
  throw new Error("La clave de encriptación debe ser de 32 bytes.");
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // Debe ser de 16 bytes
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(payload: string): string {
  const [ivHex, encryptedHex] = payload.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Formato inválido de cadena encriptada");
  }

  const iv = Buffer.from(ivHex, "hex");
  if (iv.length !== 16) {
    throw new Error("IV inválido. Se esperaban 16 bytes.");
  }

  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}
