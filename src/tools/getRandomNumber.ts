import { tool } from "ai";
import { z } from "zod";

export const getRandomNumber = tool({
  description: "获取一个随机数",
  parameters: z.object({}),
  execute: async () => {
    return {
      data: Math.random(),
    };
  },
});
