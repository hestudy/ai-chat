"use server";

import { lucia } from "@/auth";
import { db } from "@/db";
import { RegisterData, registerSchema } from "@/schemas/registerSchema";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export const register = async (data: RegisterData) => {
  "use server";

  const validate = await registerSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      error: validate.error.errors?.[0]?.message,
    };
  }

  if (validate.data.password !== validate.data.confirmPassword) {
    return {
      success: false,
      error: "两次密码不一致",
    };
  }

  const findUser = await db.user.findUnique({
    where: {
      email: validate.data.email,
    },
  });
  if (findUser) {
    return {
      success: false,
      error: "邮箱已被注册",
    };
  }

  const passwordHash = await hash(validate.data.password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10);
  const user = await db.user.create({
    data: {
      id: userId,
      username: validate.data.username,
      password_hash: passwordHash,
      email: validate.data.email,
    },
  });
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return {
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};
