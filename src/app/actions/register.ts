"use server";

import { db } from "@/db";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export type RegisterData = z.infer<typeof registerSchema>;

export async function register(data: RegisterData) {
  "use server";
  const validate = registerSchema.safeParse(data);
  if (!validate.success) {
    return validate;
  }
  db.getInstance().prisma.user.create({
    data: {
      ...validate.data,
    },
  });
}
