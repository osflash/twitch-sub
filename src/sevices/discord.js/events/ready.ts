import client from "../../discord.js";
import { channels, instagramUsers } from "../../../config";

client.on("ready", async () => {
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

client.on("error", console.error);
client.on("shardError", console.error);
client.on("debug", console.error);
client.on("warn", console.error);
