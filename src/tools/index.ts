import { dalle } from "./dalle";
import { getRandomNumber } from "./getRandomNumber";

export const tools = {
  getRandomNumber: getRandomNumber.tool,
  dalle: dalle.tool,
};

export const allTools = {
  getRandomNumber,
  dalle,
};
