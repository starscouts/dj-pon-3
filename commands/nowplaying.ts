import {CommandBase} from "../core/CommandBase";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {PlayCommand} from "./play";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";

export class NowPlayingCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("nowplaying")
            .setDescription("Shows info about the currently playing song")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.playing) {
            interaction.reply(PlayCommand.nowPlaying(0))
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: The bot is not playing.")
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"play","args":{}}')
                                .setLabel('Play')
                                .setStyle('SECONDARY'),
                        )
                ]
            });
        }
    }
}
