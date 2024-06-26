import { tool } from "ai";
import fs, { existsSync, mkdirSync } from "fs";
import { nanoid } from "nanoid";
import Openai from "openai";
import path from "path";
import { z } from "zod";

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
      const data = res?.data?.[0];
      const url = data?.url;
      if (url) {
        const blob = await fetch(url).then((res) => res.blob());
        const id = nanoid();
        const dirPath = path.join(process.cwd(), "prisma", "data", "images");
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `${id}.png`);
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        return {
          success: true,
          data: {
            url: `/api/image/${id}.png`,
            prompt: data.revised_prompt,
          },
        };
      }
    } catch (e) {
      return {
        success: false,
        error: (e as Error)?.message,
      };
    }
  },
});
