import { getAuthProvider } from "./auth";
import { ChatClient } from "@twurple/chat";
import type { CommandHandler } from "./types/command";
import lurk from "./commands/lurk";
import coins from "./commands/coins";

const authProvider = await getAuthProvider();
const commands = new Map<string, CommandHandler>();
commands.set("lurk", lurk);
commands.set("coins", coins);

const chatClient = new ChatClient({
  authProvider,
  channels: ["kingbri1st"],
});
chatClient.connect();

chatClient.onConnect(() => {
  console.log("Connected to chat!");
});

chatClient.onDisconnect((manually, reason) => {
  console.log("Disconnected from chat!", { manually, reason });
});

chatClient.onAuthenticationFailure(() => {
  console.log("Authentication failed!");
});

chatClient.onMessage(async (channel, user, text, msg) => {
  const prefix = "!";
  if (!text.startsWith(prefix)) {
    return;
  }

  const command = text.trim().split(" ");
  if (command.length === 0 || !command[0]) {
    return;
  }

  const cmdName = command[0].slice(prefix.length);
  const cmdParams = command.slice(1);

  const cmdHandler = commands.get(cmdName);
  if (!cmdHandler) {
    return;
  }

  const ctx = {
    chat: chatClient,
    channel,
  };

  await cmdHandler(ctx, msg, cmdParams);
});
