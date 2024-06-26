import { tool } from "ai";
import { z } from "zod";
import Openai from "openai";

const openai = new Openai({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const dalle = tool({
  description: "使用dalle进行绘画",
  parameters: z.object({
    prompt: z.string(),
  }),
  execute: async ({ prompt }) => {
    try {
      const res = await openai.images.generate({
        model: "dall-e-3",
        n: 1,
        size: "1024x1024",
        prompt,
      });
      return {
        success: true,
        data: res?.data?.[0],
      };
    } catch (e) {
      return {
        success: false,
        error: (e as Error)?.message,
      };
    }
  },
});
