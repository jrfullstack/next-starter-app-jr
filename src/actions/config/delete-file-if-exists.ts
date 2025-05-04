// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename */
"use server";

import { existsSync, unlinkSync } from "fs";
import path from "path";

export async function deleteFileIfExists(fileUrl?: string, baseFolder = "uploads") {
  if (!fileUrl || !fileUrl.startsWith(`/${baseFolder}/`)) return;

  const folderPath = path.resolve(process.cwd(), "public", baseFolder);
  const fullPath = path.resolve(process.cwd(), "public", fileUrl);

  if (!fullPath.startsWith(folderPath)) {
    console.warn("[DELETE_FILE] Ruta fuera del directorio permitido:", fullPath);
    return;
  }

  if (existsSync(fullPath)) {
    unlinkSync(fullPath);
  }
}
