"use client";

import { chat } from "@/actions/chat";
import { getMessage, saveMessage } from "@/actions/message";
import MessageDirection from "@/components/MessageDirection";
import MessageItem from "@/components/MessageItem";
import GridPattern from "@/components/ui/magicui/animated-grid-pattern";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceFn, useRequest } from "ahooks";
import { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { isArray } from "radash";
import { useState } from "react";

const page = () => {
  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useState<(CoreMessage & { id: string })[]>(
    []
  );
  const { id } = useParams();

  useRequest(async () => {
    const res = await getMessage({ id: id as string });
    if (res.data?.content) {
      setMessages(JSON.parse(res.data.content));
    }
  });

  const { run: save } = useDebounceFn(
    () => {
      saveMessage({
        id: id as string,
        content: JSON.stringify(messages),
      });
    },
    {
      wait: 300,
    }
  );

  return (
    <div className="h-full mx-auto relative">
      <GridPattern className="z-1"></GridPattern>
      <div className="absolute z-2 w-full h-full">
        <div className="mx-auto w-[800px] h-full p-2">
          <div className="bg-white h-full rounded shadow border p-2 flex flex-col">
            <div className="flex-1 h-0 mb-2">
              <ScrollArea className="h-full">
                {messages.map((item) => {
                  return (
                    <MessageDirection key={item.id} item={item}>
                      <MessageItem item={item}></MessageItem>
                    </MessageDirection>
                  );
                })}
              </ScrollArea>
            </div>
            <div>
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                placeholder="嘿，来聊点什么"
                onKeyDown={async (e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    if (input) {
                      e.preventDefault();
                      const newMessages: typeof messages = [
                        ...messages,
                        { id: nanoid(), role: "user", content: input },
                      ];
                      setMessages(newMessages);
                      setInput("");
                      const result = await chat(
                        newMessages.map((item) => {
                          const { id, ...props } = item;
                          return props;
                        })
                      );
                      let content = "";
                      for await (const data of readStreamableValue(
                        result.content
                      )) {
                        if (data?.type === "text-delta") {
                          setMessages([
                            ...newMessages,
                            {
                              id: nanoid(),
                              role: "assistant",
                              content: (content += data.textDelta),
                            },
                          ]);
                        }
                        if (data?.type === "tool-call") {
                          setMessages((messages) => [
                            ...messages,
                            {
                              id: nanoid(),
                              role: "assistant",
                              content: [data],
                            },
                          ]);
                        }
                        if (data?.type === "tool-result") {
                          setMessages((messages) => [
                            ...messages,
                            {
                              id: nanoid(),
                              role: "tool",
                              content: [data],
                            },
                          ]);
                        }
                        if (data?.type === "finish") {
                          save();
                        }
                      }
                    }
                  }
                }}
              ></Textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
