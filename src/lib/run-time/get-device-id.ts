import { load } from "@fingerprintjs/fingerprintjs";

export const getDeviceId = async (): Promise<string> => {
  const fp = await load();
  const result = await fp.get();
  return result.visitorId;
};
