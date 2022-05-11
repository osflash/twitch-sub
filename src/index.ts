import { GatewayServer, SlashCreator } from "slash-create";
import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import InstagramCommand from "./commands/instagram";
import { channels, instagramUsers } from "./config";
import express from "express";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  console.log("Ready!");

  res.status(200).json({});
});

app.listen(process.env.PORT);

const client = new Client<true>({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE", "CHANNEL"],
});

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID as string,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  client,
});

creator
  .withServer(
    new GatewayServer((handler) => client.ws.on("INTERACTION_CREATE", handler))
  )
  .registerCommand(InstagramCommand)
  .syncCommands();

client.on("ready", async () => {
  console.log(`Logged in as ${client.user!.tag}!`);

  for (const [guildID, channelID] of channels) {
    const users = new Set<string>();
    const instagramChannel = client.channels.cache.get(channelID);

    if (instagramChannel?.isText()) {
      await instagramChannel.messages.fetch();

      instagramChannel.messages.cache.forEach((msg) => {
        if (msg.embeds && msg.embeds[0].title) {
          const user = msg.embeds[0].footer?.text;

          users.add(user!);
        }
      });

      instagramUsers.set(guildID, users);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
