import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {LogManager} from "../core/LogManager";
import {CoolLoader} from "../core/CoolLoader";

export class LoopCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("loop")
            .setDescription("Toggles repeating the entire queue")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.autodj) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            })
            return;
        }

        if (VoiceBase.connected) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(() => {
                VoiceBase.repeat = !VoiceBase.repeat
                if (VoiceBase.repeat) {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":repeat: Repeat mode is **on**.")
                        ]
                    }).then(() => {
                        LogManager.info("/loop: repeat mode enabled");
                    });
                } else {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":arrow_right_hook: Repeat mode is **off**.")
                        ]
                    }).then(() => {
                        LogManager.info("/loop: repeat mode disabled");
                    });
                }
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