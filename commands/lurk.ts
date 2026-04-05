import type { ChatMessage } from "@twurple/chat";
import type { CommandCtx } from "../types/command";

export default async function lurk(ctx: CommandCtx, msg: ChatMessage) {
  await ctx.chat.say(ctx.channel, `@${msg.userInfo.displayName} is lurking...`);
}
