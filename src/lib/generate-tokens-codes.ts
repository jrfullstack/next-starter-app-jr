/**
 * Genera un código de verificación seguro de 6 dígitos
 * Usa crypto.getRandomValues() cuando está disponible (navegadores/Node 15+)
 * Retorna string para preservar ceros a la izquierda
 */
export const generateVerificationCode = (): string => {
  // Usar la API Crypto cuando esté disponible (más seguro)
  if (crypto != undefined && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (100_000 + (array[0] % 900_000)).toString();
  }

  // Fallback para entornos sin crypto (menos seguro pero funcional)
  return (100_000 + crypto.randomInt(0, 900_000)).toString();
};

/**
 * Alternativa usando window.crypto para navegadores
 * (Versión más explícita para frontend)
 */
export const generateBrowserVerificationCode = (): string => {
  const array = new Uint32Array(1);
  globalThis.crypto.getRandomValues(array);
  return (100_000 + (array[0] % 900_000)).toString();
};

/**
 * Versión para Node.js con crypto module
 */
import crypto from "crypto";

export const generateNodeVerificationCode = (): string => {
  const randomBytes = crypto.randomBytes(4);
  const number = randomBytes.readUInt32BE(0);
  return (100_000 + (number % 900_000)).toString();
};
