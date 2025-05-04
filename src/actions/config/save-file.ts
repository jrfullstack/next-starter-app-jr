/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */
"use server";
import { mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";

export async function saveFile(
  file: File,
  uploadsDir: string,
  prefix: string = "file",
): Promise<{ url: string; filePath: string }> {
  const ext = path.extname(file.name);
  const filename = `${prefix}-${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  // Asegurar que el directorio existe
  mkdirSync(uploadsDir, { recursive: true });

  // Validación de seguridad para la ruta del archivo
  const safeUploadsDir = path.resolve(uploadsDir);
  const safeFilePath = path.resolve(filePath);
  if (!safeFilePath.startsWith(safeUploadsDir)) {
    throw new Error("Ruta de archivo no permitida");
  }

  // Escribir el archivo
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    filePath,
  };
}
