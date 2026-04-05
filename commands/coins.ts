import type { ChatMessage } from "@twurple/chat";
import type { CommandCtx } from "../types/command";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default async function coins(ctx: CommandCtx, msg: ChatMessage) {
  await ctx.chat.say(
    ctx.channel,
    `@${msg.userInfo.displayName} earned ${getRandomInt(100)} coins`,
  );
}
