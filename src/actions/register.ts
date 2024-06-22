"use server";

import { db } from "@/db";
import { RegisterData, registerSchema } from "@/schemas/registerSchema";
import bcrypt from "bcrypt";
import { tryit } from "radash";

export async function register(data: RegisterData) {
  "use server";
  const validate = registerSchema.safeParse(data);
  if (!validate.success) {
    return validate;
  }
  if (validate.data.password !== validate.data.confirmPassword) {
    return { success: false, error: "两次密码不一致" };
  }

  const { confirmPassword, ...props } = validate.data;
  const [err, user] = await tryit(db.getInstance().prisma.user.create)({
    data: {
      ...props,
      password: await bcrypt.hash(validate.data.password, 10),
    },
  });

  if (err) {
    return { success: false, error: "注册失败，邮箱可能已经被注册" };
  }

  return {
    success: true,
    data: {
      id: user?.id,
    },
  };
}
