"use client";

import GridPattern from "@/components/ui/magicui/animated-grid-pattern";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { CoreMessage } from "ai";
import { useAIState } from "ai/rsc";
import { useState } from "react";

const page = () => {
  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useAIState();

  return (
    <div className="h-full mx-auto relative">
      <GridPattern className="z-1"></GridPattern>
      <div className="absolute z-2 w-full h-full">
        <div className="mx-auto w-[800px] h-full p-2">
          <div className="bg-white h-full rounded shadow border p-2 flex flex-col">
            <div className="flex-1 h-0">
              <ScrollArea className="h-full"></ScrollArea>
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
