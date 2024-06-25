import { z } from "zod";

export const saveMessageSchema = z.object({
  id: z.string().min(1, { message: "id不能为空" }),
  content: z.string().min(1, { message: "内容不能为空" }),
});

export type SaveMessageData = z.infer<typeof saveMessageSchema>;

export const getMessageSchema = z.object({
  id: z.string().min(1, { message: "id不能为空" }),
});

export type GetMessageData = z.infer<typeof getMessageSchema>;
