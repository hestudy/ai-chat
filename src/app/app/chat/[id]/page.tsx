"use client";

import { chat } from "@/actions/chat";
import { getMessage, saveMessage } from "@/actions/message";
import MessageDirection from "@/components/MessageDirection";
import MessageItem from "@/components/MessageItem";
import MessageRecord from "@/components/MessageRecord";
import GridPattern from "@/components/ui/magicui/animated-grid-pattern";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceFn, useRequest } from "ahooks";
import { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import { LoaderCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useState<(CoreMessage & { id: string })[]>(
    []
  );

  const { id } = useParams();
  const [toolLoadingId, setToolLoadingId] = useState<string>();
  const keepDownRef = useRef(true);
  const ref = useRef<HTMLDivElement>(null);

  const scrollDown = () => {
    if (keepDownRef.current && ref.current) {
      setTimeout(() => {
        ref.current!.scrollTop = ref.current!.scrollHeight;
      });
    }
  };

  const { loading } = useRequest(async () => {
    const res = await getMessage({ id: id as string });
    if (res.data?.content) {
      setMessages(JSON.parse(res.data.content));
    }
  });

  useEffect(() => {
    scrollDown();
  }, [messages, loading]);

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

  const { run: sendSystem } = useRequest(
    async () => {
      const result = await chat(
        messages.map((item) => {
          const { id, ...props } = item;
          return props;
        })
      );
      let content = "";
      for await (const data of readStreamableValue(result.content)) {
        if (data?.type === "text-delta") {
          setMessages([
            ...messages,
            {
              id: nanoid(),
              role: "assistant",
              content: (content += data.textDelta),
            },
          ]);
        }
        if (data?.type === "tool-call") {
          setToolLoadingId(data.toolCallId);
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
          setToolLoadingId(undefined);
          setMessages((messages) => [
            ...messages,
            {
              id: nanoid(),
              role: "tool",
              content: [data],
            },
          ]);
          sendSystem();
        }
        save();
      }
    },
    {
      manual: true,
      debounceWait: 300,
    }
  );

  const { run: send } = useRequest(
    async () => {
      const newMessages: typeof messages = [
        ...messages,
        { id: nanoid(), role: "user", content: input! },
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
      for await (const data of readStreamableValue(result.content)) {
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
          setToolLoadingId(data.toolCallId);
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
          setToolLoadingId(undefined);
          setMessages((messages) => [
            ...messages,
            {
              id: nanoid(),
              role: "tool",
              content: [data],
            },
          ]);
          sendSystem();
        }
        save();
      }
    },
    {
      manual: true,
    }
  );

  return (
    <div className="h-full mx-auto relative">
      <GridPattern className="z-1"></GridPattern>
      <div className="absolute z-2 w-full h-full">
        <div className="mx-auto w-[800px] h-full p-2">
          <div className="bg-white h-full rounded shadow border p-2 flex flex-col">
            {loading && (
              <div className="h-full flex justify-center items-center">
                <LoaderCircle className="animate-spin" />
              </div>
            )}
            {!loading && (
              <>
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <MessageRecord></MessageRecord>
                  </div>
                  <div></div>
                </div>
                <Separator className="my-2"></Separator>
                <div className="flex-1 h-0 mb-2">
                  <ScrollArea
                    className="h-full overflow-y-auto"
                    ref={ref}
                    onScroll={(e) => {
                      keepDownRef.current =
                        e.currentTarget.scrollTop +
                          e.currentTarget.clientHeight ===
                        e.currentTarget.scrollHeight;
                    }}
                  >
                    {messages.map((item) => {
                      return (
                        <MessageDirection key={item.id} item={item}>
                          <MessageItem
                            item={item}
                            toolLoadingId={toolLoadingId}
                          ></MessageItem>
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
                          send();
                        }
                      }
                    }}
                  ></Textarea>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
