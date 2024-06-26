"use client";

import { getAllMessage } from "@/actions/message";
import { useRequest } from "ahooks";
import { LoaderCircle, Menu } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const MessageRecord = () => {
  const { run, data, loading } = useRequest(
    async () => {
      const res = await getAllMessage();
      if (res.success) {
        return res.data;
      }
    },
    {
      manual: true,
    }
  );

  return (
    <Sheet
      onOpenChange={(v) => {
        if (v) {
          run();
        }
      }}
    >
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>会话记录</SheetTitle>
        </SheetHeader>
        <div className="flex-1 h-0">
          {loading && (
            <div className="h-full flex justify-center items-center">
              <LoaderCircle className="animate-spin" />
            </div>
          )}
          {!loading && (
            <ScrollArea className="h-full">
              {data?.map((item) => {
                return <div key={item.id}>{item.title}</div>;
              })}
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MessageRecord;
