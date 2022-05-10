import axios from "axios";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import {
  SlashCommand,
  CommandOptionType,
  SlashCreator,
  CommandContext,
} from "slash-create";

import { channels, instagramUsers } from "../config";

export default class SubCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "instagram",
      description: "Vincule seu instagram com o discord.",
      options: [
        {
          type: CommandOptionType.STRING,
          name: "usuário",
          description: "Digite seu nome de usuário no instagram!",
          required: true,
        },
      ],
    });
  }

  onError(err: Error, ctx: CommandContext) {
    console.error(err);
  }

  async run(ctx: CommandContext) {
    const { id } = ctx.user;
    const client = ctx.creator.client as Client<true>;
    const username = ctx.options["usuário"] as string;

    const guild = client.guilds.cache.get(ctx.guildID!);

    if (!guild) throw new Error("Guild não foi encontrada!");

    const channelID = channels.get(ctx.guildID!);

    if (!channelID) throw new Error("ChannelID não foi encontrada!");

    const instagramChannel = guild.channels.cache.get(channelID);

    let users = instagramUsers.get(ctx.guildID!);

    if (!users) {
      users = new Set<string>();
    }

    if (!users.has(id)) {
      if (instagramChannel?.isText()) {
        const embed = new MessageEmbed()
          .setColor("RED")
          .setTitle(`${username}`)
          .setURL(`https://www.instagram.com/${username}/`)
          .setDescription(`<@${id}> pediu para entrar no Close Friends!`)
          .addField("Usuário", username)
          .setFooter({ text: id })
          .setTimestamp();

        await instagramChannel.send({ embeds: [embed] });

        users.add(id);

        instagramUsers.set(ctx.guildID!, users);
      }

      await ctx.send("Seu pedido para o Close Friends foi enviado!", {
        ephemeral: true,
      });
    } else {
      await ctx.send("Seu pedido já foi enviado!", { ephemeral: true });
    }
  }
}
