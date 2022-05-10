import { GatewayServer, SlashCreator } from "slash-create";
import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import InstagramCommand from "./commands/instagram";
import { channels, instagramUsers } from "./config";

dotenv.config();

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

  channels.forEach(async (channelID) => {
    const instagramChannel = client.channels.cache.get(channelID!);

    if (instagramChannel?.isText()) {
      await instagramChannel.messages.fetch();

      instagramChannel.messages.cache.forEach((msg) => {
        if (msg.embeds && msg.embeds[0].title) {
          const user = msg.embeds[0].footer?.text;

          instagramUsers.add(user!);
        }
      });
    }
  });
});

client.login(process.env.DISCORD_BOT_TOKEN);
