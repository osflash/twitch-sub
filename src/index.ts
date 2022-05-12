import "dotenv/config";

import app from "./app";
import client from "./sevices/discord.js";

import InstagramCommand from "./commands/instagram";
import creator from "./sevices/slash-create";
import { GatewayServer } from "slash-create";

const server = app.listen(process.env.PORT || 3000, async () => {
  try {
    creator
      .withServer(
        new GatewayServer((handler) =>
          client.ws.on("INTERACTION_CREATE", handler)
        )
      )
      .registerCommand(InstagramCommand)
      .syncCommands();

    // events
    await import("./sevices/discord.js/events");

    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.error(err);
  }
});

const exit = async () => {
  console.info("Closing");

  client.destroy();
  server.close();

  process.exit(1);
};

/**
 * Redirects process exiting to custom exit function.
 */
process.on("SIGHUP", exit);
process.on("SIGQUIT", exit);
process.on("SIGTERM", exit);
process.on("SIGINT", exit);

if (process.platform === "win32") process.on("SIGKILL", exit);
