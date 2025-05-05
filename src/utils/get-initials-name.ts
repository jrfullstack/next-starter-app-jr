// Define getInitials para aceptar un string directamente
export const getInitialsName = (userName: string) => {
  if (!userName) return "";

  const nameParts = userName.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");

  // Si hay más de una palabra, tomamos la primera letra de las dos primeras palabras
  return initials.length > 1 ? initials.slice(0, 2).toUpperCase() : initials.toUpperCase();
};
