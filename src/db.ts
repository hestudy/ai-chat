import { PrismaClient } from "@prisma/client";

export const db = (() => {
  let instance: ReturnType<typeof createInstance> | null = null;

  function createInstance() {
    const prisma = new PrismaClient();
    return {
      prisma,
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
