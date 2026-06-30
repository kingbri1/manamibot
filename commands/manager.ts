import lurk from "./lurk";
import coins from "./coins";
import type { CommandHandler } from "../types/command";
import {
    customCommandHandler,
    registerCustomCommands,
    customAdmin,
} from "./custom";
import type { ChatClient, ChatMessage } from "@twurple/chat";

const prefix = "!";
export const commands = new Map<string, CommandHandler>();

export async function registerCommands() {
    commands.set("lurk", lurk);
    commands.set("coins", coins);
    commands.set("command", customAdmin);

    await registerCustomCommands();
}

export async function handleCommand(
    chatClient: ChatClient,
    text: string,
    channel: string,
    msg: ChatMessage,
) {
    const command = text.trim().split(" ");
    if (command.length === 0 || !command[0]) {
        return;
    }

    const cmdName = command[0].slice(prefix.length);
    const cmdParams = command.slice(1);

    const ctx = {
        chat: chatClient,
        channel,
    };

    const cmdHandler = commands.get(cmdName);

    // Execute custom command if no handler found
    if (cmdHandler) {
        await cmdHandler(ctx, msg, cmdParams);
    } else {
        await customCommandHandler(ctx, msg, cmdName);
    }
}
