"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { createAI, createStreamableValue, getAIState, streamUI } from "ai/rsc";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const chat = async (message: string) => {
  "use server";

  const hidtory = getAIState();

  const content = createStreamableValue();

  const { textStream } = await streamText({
    model: openai("gpt-3.5-turbo"),
    system: "你是一位友好的机器人助手",
    prompt: "你将充满善意的回答每一个问题",
  });
  let text = "";
  for await (const textPart of textStream) {
    text += textPart;
    content.update(text);
  }
  content.done();

  return {
    content: content.value,
  };
};

export const AI = createAI({
  initialAIState: [],
  initialUIState: [],
  actions: {
    chat,
  },
});
