import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {PlayCommand} from "./play";
import {CommandAction} from "../core/CommandAction";
import {CoolLoader} from "../core/CoolLoader";

export class ReplayCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("replay")
            .setDescription("Restarts playing the current track")
    }

    public handle(action: CommandAction) {
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

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(() => {
                VoiceBase.playing = false;
                try {
                    clearInterval(global.waitUntilDoneInterval);
                } catch (e) {
                }
                let cmd = new PlayCommand();
                cmd.play(interaction, true);
            });
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