import { CoreTool, tool } from "ai";

export type ToolFactory = {
  reply: boolean;
  tool: CoreTool;
};

export const toolFactory = (props: ToolFactory) => props;
