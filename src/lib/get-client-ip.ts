export const getClientIp = (headers: Headers): string | null => {
  const forwardedFor = headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0] || null;
};
