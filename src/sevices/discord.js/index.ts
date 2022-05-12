import { Client, Intents } from "discord.js";

const client = new Client<true>({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE", "CHANNEL"],
});

export default client;
