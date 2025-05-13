export const getUserAgent = (headers: Headers): string | null => {
  const userAgent = headers.get("user-agent") || "unknown";
  return userAgent;
};
