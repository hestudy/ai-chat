"use client";

import { deleteMessage, getAllMessage } from "@/actions/message";
import { useRequest } from "ahooks";
import { LoaderCircle, Menu, Trash } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import PopoverConfirm from "./PopoverConfirm";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const MessageRecord = () => {
  const router = useRouter();
  const { id } = useParams();
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
                return (
                  <Link replace key={item.id} href={`/app/chat/${item.id}`}>
                    <div
                      className={cn(
                        "flex justify-between items-center mb-1 hover:bg-gray-100 p-2 rounded",
                        id === item.id && "bg-gray-100"
                      )}
                    >
                      <div>{item.title}</div>
                      <PopoverConfirm
                        title="删除提醒"
                        content="确定删除此会话吗？"
                        onConfirm={async () => {
                          await deleteMessage({ id: item.id });
                          toast.success("删除成功");
                          run();
                          if (id === item.id) {
                            const id = nanoid();
                            router.replace(`/app/chat/${id}`);
                          }
                        }}
                      >
                        <Trash className="size-4" />
                      </PopoverConfirm>
                    </div>
                  </Link>
                );
              })}
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MessageRecord;
