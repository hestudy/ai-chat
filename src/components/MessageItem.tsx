import { CoreMessage } from "ai";
import copy from "clipboard-copy";
import { Clipboard, LoaderCircle } from "lucide-react";
import { isArray } from "radash";
import MarkDown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

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
          <Badge variant={"secondary"}>
            运行工具：{item.content[0].toolName}
            {toolLoadingId === item.content[0].toolCallId && (
              <LoaderCircle className="animate-spin size-4 ml-2" />
            )}
          </Badge>
        );
      }
    }
  }

  if (item.role === "tool") {
    return (
      <Collapsible>
        <CollapsibleTrigger>
          <Badge variant={"outline"}>查看运行结果</Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-gray-100 p-2 rounded mt-2">
          <ReactJson src={item.content[0].result as any}></ReactJson>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div>
      <MarkDown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="relative">
                <div className="absolute right-2 top-2">
                  <Clipboard
                    color="white"
                    className="size-5 cursor-pointer"
                    onClick={() => {
                      copy(String(children).replace(/\n$/, ""))
                        .then(() => {
                          toast.success("已复制到剪贴板");
                        })
                        .catch(() => {
                          toast.error("复制失败，请重试");
                        });
                    }}
                  />
                </div>
                {/* @ts-ignore */}
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  style={darcula}
                  showLineNumbers
                />
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
          p(props) {
            const { node, ...reset } = props;
            return (
              <p className="leading-7 [&:not(:first-child)]:mt-6" {...reset} />
            );
          },
        }}
      >
        {item.content as string}
      </MarkDown>
    </div>
  );
};

export default MessageItem;
