import { CoreMessage } from "ai";
import { isArray } from "radash";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const MessageItem = ({ item }: { item: CoreMessage }) => {
  if (item.role === "assistant") {
    if (isArray(item.content)) {
      if (item.content[0].type === "tool-call") {
        return <Badge>调用工具：{item.content[0].toolName}</Badge>;
      }
    }
  }

  if (item.role === "tool") {
    return (
      <div className="p-2 rounded bg-gray-100">
        <div className="mb-2">
          <Badge>调用结果：{item.content[0].result as string}</Badge>
        </div>
        <div>
          <Button size={"sm"} variant={"secondary"} className="w-full">
            使用此结果
          </Button>
        </div>
      </div>
    );
  }

  return <div>{item.content.toString()}</div>;
};

export default MessageItem;
