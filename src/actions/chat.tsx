"use server";

import { tools } from "@/tools";
import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const chat = async (messages: CoreMessage[]) => {
  "use server";

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    system: "你是一位友好的机器人助手",
    messages,
    tools,
  });

  const streamed = createStreamableValue(result.fullStream);

  return { content: streamed.value };
};
