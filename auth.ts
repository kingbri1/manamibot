import { RefreshingAuthProvider, type AccessToken } from "@twurple/auth";
import type { Creds, Tokens } from "./types/auth";
import fs from "fs/promises";

async function loadCreds(): Promise<Creds> {
  const data = await fs.readFile("creds.json", "utf8");
  return JSON.parse(data) as Creds;
}

async function loadTokens(): Promise<AccessToken> {
  const data = await fs.readFile("tokens.json", "utf8");
  return JSON.parse(data) as AccessToken;
}

export async function getAuthProvider() {
  const creds = await loadCreds();
  const tokens = await loadTokens();

  const authProvider = new RefreshingAuthProvider({
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
  });

  authProvider.onRefresh(async (_, newTokenData) => {
    await fs.writeFile("tokens.json", JSON.stringify(newTokenData, null, 2));
  });

  await authProvider.addUserForToken(tokens, ["chat"]);

  return authProvider;
}
