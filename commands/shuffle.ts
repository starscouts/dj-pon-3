import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {CoolLoader} from "../core/CoolLoader";

export class ShuffleCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("shuffle")
            .setDescription("Randomly changes the queue's order")
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
                VoiceBase.queue.shuffle();
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":white_check_mark: Randomly mixed the queue's order")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('{"command":"play","args":{}}')
                                    .setLabel('Play')
                                    .setStyle('PRIMARY')
                                    .setDisabled(global.VoiceBase.playing),
                                new MessageButton()
                                    .setCustomId('{"_custom":"addModal"}')
                                    .setLabel('Add')
                                    .setStyle('SUCCESS'),
                                new MessageButton()
                                    .setCustomId('{"command":"queue","args":{}}')
                                    .setLabel('View Queue')
                                    .setStyle('SECONDARY'),
                            )
                    ]
                })
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