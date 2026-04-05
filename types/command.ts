import { ChatClient, ChatMessage } from "@twurple/chat";

export type CommandCtx = {
  chat: ChatClient;
  channel: string;
};

export type CommandHandler = (
  ctx: CommandCtx,
  message: ChatMessage,
  params: string[],
) => Promise<void>;
