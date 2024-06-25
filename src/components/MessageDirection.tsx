import { CoreMessage } from "ai";
import { PropsWithChildren } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

const MessageDirection = ({
  item,
  children,
}: PropsWithChildren<{ item: CoreMessage }>) => {
  return (
    <div
      className={cn("flex mb-4", item.role === "user" && "flex-row-reverse")}
    >
      <div className={cn("shrink-0", item.role !== "user" && "mr-2")}>
        <Avatar>
          {item.role !== "user" && <AvatarFallback>AI</AvatarFallback>}
          {item.role === "user" && <AvatarFallback>ME</AvatarFallback>}
        </Avatar>
      </div>
      <div
        className={cn(
          "flex-1 w-0 shrink-0",
          item.role === "user" && "flex justify-end mr-2"
        )}
      >
        <div
          className={cn(
            "w-fit",
            typeof item.content === "string" && "p-2 bg-gray-100 rounded"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MessageDirection;
