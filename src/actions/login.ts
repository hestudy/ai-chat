"use server";

import { lucia } from "@/auth";
import { db } from "@/db";
import { LoginData, loginSchema } from "@/schemas/loginSchema";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";

export const login = async (data: LoginData) => {
  "use server";
  const validate = await loginSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      error: validate.error.errors?.[0]?.message,
    };
  }

  const user = await db.user.findUnique({
    where: {
      email: validate.data.email,
    },
  });
  if (!user) {
    return {
      success: false,
      error: "用户不存在",
    };
  }

  const validPassword = await verify(
    user.password_hash,
    validate.data.password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    }
  );
  if (!validPassword) {
    return {
      success: false,
      error: "密码错误",
    };
  }

  const session = await lucia.createSession(user.id, {});
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
