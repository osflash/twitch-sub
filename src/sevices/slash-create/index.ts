import { SlashCreator } from "slash-create";

import client from "../discord.js";

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID!,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  client,
});

export default creator;
