import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "邮箱不能为空" })
    .email({ message: "邮箱格式不正确" }),
  password: z.string().min(6, { message: "密码长度至少为6" }),
});

export type LoginData = z.infer<typeof loginSchema>;
