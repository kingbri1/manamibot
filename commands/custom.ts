import type { CommandCtx, CommandHandler } from "../types/command";
import { db } from "../db/dbProvider";
import { commands as commandsSchema } from "../db/drizzle/schema";
import type { ChatMessage } from "@twurple/chat";

const customCommands = new Map<string, string>();

export async function registerCustomCommands() {
    const customCommandQuery = await db.select().from(commandsSchema);
    customCommandQuery.forEach((cmd) => {
        customCommands.set(cmd.name, cmd.action);
    });
}

export async function customCommandHandler(
    ctx: CommandCtx,
    msg: ChatMessage,
    command: string,
) {
    const action = customCommands.get(command);
    if (!action) return;

    const replacedAction = action.replace(
        "{{user}}",
        `@${msg.userInfo.displayName}`,
    );

    await ctx.chat.say(ctx.channel, replacedAction);
}
