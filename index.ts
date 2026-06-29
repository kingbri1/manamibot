import { getAuthProvider } from "./auth";
import { ChatClient } from "@twurple/chat";
import { handleCommand, registerCommands } from "./commands/manager";
import { initializeDatabase } from "./db/dbProvider";

const authProvider = await getAuthProvider();
registerCommands();
initializeDatabase();

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

chatClient.onMessage(async (channel, _user, text, msg) => {
    await handleCommand(chatClient, text, channel, msg);
});
