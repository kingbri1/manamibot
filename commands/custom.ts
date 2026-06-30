import type { CommandCtx, CommandHandler } from "../types/command";
import { db } from "../db/dbProvider";
import { commands as commandsTable } from "../db/drizzle/schema";
import type { ChatMessage } from "@twurple/chat";
import { eq } from "drizzle-orm";

const customCommands = new Map<string, string>();

export async function registerCustomCommands() {
    const customCommandQuery = await db.select().from(commandsTable);
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

export async function customAdmin(
    ctx: CommandCtx,
    msg: ChatMessage,
    params: string[],
) {
    const subcommand = params.shift();
    switch (subcommand) {
        case "list":
            await listCustomCommands(ctx, msg);
            break;
        case "set":
            await addCustomCommand(ctx, msg, params);
            break;
        case "delete":
            await deleteCustomCommand(ctx, msg, params);
            break;
        default:
            await ctx.chat.say(
                ctx.channel,
                "Please provide a subcommand! (list, set, delete)",
            );
            return;
    }
}

async function listCustomCommands(ctx: CommandCtx, _msg: ChatMessage) {
    const commandNames = [...customCommands.keys()].join(", ");
    await ctx.chat.say(
        ctx.channel,
        `Commands in this channel: ${commandNames}`,
    );
}

async function addCustomCommand(
    ctx: CommandCtx,
    msg: ChatMessage,
    params: string[],
) {
    if (!msg.userInfo.isMod && !msg.userInfo.isBroadcaster) {
        await ctx.chat.say(
            ctx.channel,
            "You don't have permission to execute this action.",
        );
        return;
    }

    const name = params.shift();
    if (!name) {
        await ctx.chat.say(
            ctx.channel,
            "Please provide a name for the custom command!",
        );
        return;
    }

    const action = params.join(" ");
    if (!action) {
        await ctx.chat.say(
            ctx.channel,
            "Please provide an action for the custom command!",
        );
        return;
    }

    // Update DB then cache
    await db.insert(commandsTable).values({ name, action }).onConflictDoUpdate({
        target: commandsTable.name,
        set: {
            action,
        },
    });
    customCommands.set(name, action);

    ctx.chat.say(ctx.channel, `Custom command ${name} added successfully`);
}

async function deleteCustomCommand(
    ctx: CommandCtx,
    msg: ChatMessage,
    params: string[],
) {
    if (!msg.userInfo.isMod && !msg.userInfo.isBroadcaster) {
        await ctx.chat.say(
            ctx.channel,
            "You don't have permission to execute this action.",
        );
        return;
    }

    const name = params.shift();
    if (!name) {
        await ctx.chat.say(
            ctx.channel,
            "Please provide a name for the custom command!",
        );
        return;
    }

    if (!customCommands.has(name)) {
        await ctx.chat.say(ctx.channel, `Custom command ${name} not found`);
        return;
    }

    await db.delete(commandsTable).where(eq(commandsTable.name, name));
    customCommands.delete(name);

    ctx.chat.say(ctx.channel, `Custom command ${name} deleted successfully`);
}
