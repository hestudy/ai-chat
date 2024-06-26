import { z } from "zod";

export const idSchema = z.object({
  id: z.string().min(1, { message: "id不能为空" }),
});

export type IdData = z.infer<typeof idSchema>;
