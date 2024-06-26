import { z } from "zod";
import { IdData, idSchema } from "./idSchema";

export const saveMessageSchema = z.object({
  id: z.string().min(1, { message: "id不能为空" }),
  content: z.string().min(1, { message: "内容不能为空" }),
});

export type SaveMessageData = z.infer<typeof saveMessageSchema>;

export const getMessageSchema = idSchema;

export type GetMessageData = IdData;
