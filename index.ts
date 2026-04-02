import { Bot, createBotCommand } from "@twurple/easy-bot";
import { RefreshingAuthProvider } from "@twurple/auth";
import { promises as fs } from "fs";

interface Creds {
  clientId: string;
  clientSecret: string;
}

const creds = JSON.parse(await fs.readFile("creds.json", "utf-8")) as Creds;
const tokens = JSON.parse(await fs.readFile("tokens.json", "utf-8"));

const authProvider = new RefreshingAuthProvider({
  clientId: creds.clientId,
  clientSecret: creds.clientSecret,
});

authProvider.onRefresh(async (_, newTokenData) => {
  const newTokens = {
    accessToken: newTokenData.accessToken,
    refreshToken: newTokenData.refreshToken,
  };

  await fs.writeFile("tokens.json", JSON.stringify(newTokens, null, 2));
});

await authProvider.addUserForToken(tokens, ["chat"]);

const bot = new Bot({
  authProvider: authProvider,
  channel: "kingbri1st",
  commands: [
    createBotCommand("d20", async (params, { userName, say, timeout }) => {
      const diceRoll = Math.floor(Math.random() * 20) + 1;
      if (diceRoll === 1) {
        await say(
          `@${userName} rolled a critical failure and must be punished!`,
        );
        await timeout(30, "critical failure");
      } else if (diceRoll === 20) {
        await say(
          `Woah, critical success! @${userName} deserves all the praise!`,
        );
      } else {
        await say(`@${userName} rolled a ${diceRoll}!`);
      }
    }),
    createBotCommand("lurk", async (params, { userName, say }) => {
      await say(`@${userName} is lurking...`);
    }),
  ],
});

bot.onAuthenticationSuccess(() => {
  console.log("Connected!");
});

bot.onDisconnect((manually, reason) => {
  console.log("Disconnected!", { manually, reason });
});

bot.onAuthenticationFailure(() => {
  console.log("Authentication failed!");
});
