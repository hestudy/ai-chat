import { CoreMessage } from "ai";
import { LoaderCircle } from "lucide-react";
import OpenAI from "openai";
import { isArray } from "radash";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const MessageItem = ({
  item,
  toolLoadingId,
}: {
  item: CoreMessage;
  toolLoadingId?: string;
}) => {
  if (item.role === "assistant") {
    if (isArray(item.content)) {
      if (item.content[0].type === "tool-call") {
        return (
          <Badge>
            调用工具：{item.content[0].toolName}
            {toolLoadingId === item.content[0].toolCallId && (
              <LoaderCircle className="animate-spin size-4 ml-2" />
            )}
          </Badge>
        );
      }
    }
  }

  if (item.role === "tool") {
    if (item.content[0].toolName === "dalle") {
      const result = item.content[0].result as {
        success: boolean;
        data: OpenAI.Images.Image;
        error: string;
      };
      if (result.success) {
        return (
          <div>
            <img
              src={result.data.url}
              alt={result.data.revised_prompt}
              className="w-[300px] rounded"
            ></img>
          </div>
        );
      }

      return <Badge variant={"destructive"}>{result.error}</Badge>;
    }

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
