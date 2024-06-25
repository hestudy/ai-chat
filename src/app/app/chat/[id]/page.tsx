"use client";

import { chat } from "@/actions/chat";
import GridPattern from "@/components/ui/magicui/animated-grid-pattern";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { isArray } from "radash";

const page = () => {
  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useState<(CoreMessage & { id: string })[]>(
    []
  );

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="h-full mx-auto relative">
      <GridPattern className="z-1"></GridPattern>
      <div className="absolute z-2 w-full h-full">
        <div className="mx-auto w-[800px] h-full p-2">
          <div className="bg-white h-full rounded shadow border p-2 flex flex-col">
            <div className="flex-1 h-0">
              <ScrollArea className="h-full">
                {messages.map((item) => {
                  if (item.role === "assistant") {
                    if (isArray(item.content)) {
                      if (item.content[0].type === "tool-call") {
                        return (
                          <div key={item.id}>{item.content[0].toolName}</div>
                        );
                      }
                    }
                  }

                  if (item.role === "tool") {
                    return (
                      <div key={item.id}>
                        {item.content[0].result as string}
                      </div>
                    );
                  }

                  return <div key={item.id}>{item.content.toString()}</div>;
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
                          setMessages([
                            ...newMessages,
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
                          console.log("demo");
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
