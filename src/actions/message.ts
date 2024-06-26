"use server";

import { validateRequest } from "@/auth";
import { db } from "@/db";
import {
  GetMessageData,
  SaveMessageData,
  getMessageSchema,
  saveMessageSchema,
} from "@/schemas/messageSchema";

export const saveMessage = async (data: SaveMessageData) => {
  "use server";
  const auth = await validateRequest();
  if (!auth.user) {
    return {
      success: false,
      error: "请先登录",
    };
  }

  const validate = saveMessageSchema.safeParse(data);
  if (!validate.success) {
    return {
      success: false,
      error: validate.error.errors[0].message,
    };
  }

  const count = await db.message.count({
    where: {
      id: data.id,
    },
  });

  const isExist = count > 0;

  if (isExist) {
    const res = await db.message.update({
      where: {
        id: data.id,
      },
      data: {
        content: data.content,
      },
    });
    return {
      success: true,
      data: {
        id: res.id,
      },
    };
  }

  const res = await db.message.create({
    data: {
      id: data.id,
      content: data.content,
      userId: auth.user?.id!,
      title: `新会话${count + 1}`,
    },
  });

  return {
    success: true,
    data: {
      id: res.id,
    },
  };
};

export const getMessage = async (data: GetMessageData) => {
  "use server";
  const auth = await validateRequest();
  if (!auth.user) {
    return {
      success: false,
      error: "请先登录",
    };
  }

  const validate = getMessageSchema.safeParse(data);
  if (!validate.success) {
    return {
      success: false,
      error: validate.error.errors[0].message,
    };
  }

  const res = await db.message.findFirst({
    where: {
      id: data.id,
      userId: auth.user?.id!,
    },
  });

  return {
    success: true,
    data: res,
  };
};

export const getAllMessage = async () => {
  "use server";
  const auth = await validateRequest();
  if (!auth.user) {
    return {
      success: false,
      error: "请先登录",
    };
  }

  const res = await db.message.findMany({
    where: {
      userId: auth.user?.id!,
    },
  });

  return {
    success: true,
    data: res,
  };
};
