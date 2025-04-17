import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";

export class PauseCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("pause")
            .setDescription("Pauses currently playing music")
    }

    public handle(action: CommandAction) {
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('{"_custom":"addModal"}')
                    .setLabel('Add')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('{"command":"play","args":{}}')
                    .setLabel('Play')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('{"command":"skip","args":{}}')
                    .setLabel('Skip')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('{"command":"stop","args":{}}')
                    .setLabel('Stop')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('{"command":"queue","args":{}}')
                    .setLabel('View Queue')
                    .setStyle('SECONDARY'),
            );

        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.connected) {
            if (!VoiceBase.playing) {
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
                return;
            }

            if (VoiceBase.player.pause()) {
                VoiceBase.paused = true;
                VoiceBase.pauseStartDate = new Date();
                VoiceBase.playingTimeBeforePause = new Date().getTime() - VoiceBase.playStartDate.getTime();
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":pause_button: Paused.")
                    ], components: [row]
                });
            } else {
                interaction.reply(":x: Failed to pause, this is most likely a bug.");
            }
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"join","args":{}}')
                                .setLabel('Join')
                                .setStyle('SECONDARY'),
                        )
                ]
            });
        }
    }
}