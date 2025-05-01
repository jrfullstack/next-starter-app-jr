export const sleep = (seconds: number = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
