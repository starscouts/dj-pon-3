import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {CoolLoader} from "../core/CoolLoader";
import {AddCommand} from "./add";

export class InfoCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("info")
            .setDescription("Show information about an item in the queue")
            .addStringOption(option =>
                option.setName('index')
                    .setDescription("Index of the song to show information about")
                    .setRequired(true)
            )
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        // @ts-ignore
        let index = interaction.options.getString('index').trim() - 1 + 1;

        if (VoiceBase.autodj) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            })
            return;
        }

        if (isNaN(index) || !isFinite(index) || Math.round(index) !== index) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: Index needs to be a valid integer.")
                ]
            });
            return;
        }

        if (VoiceBase.queue.get(index - 1) === null) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: Unable to find the song at index " + index + ".")
                ]
            });
            return;
        }

        if (VoiceBase.connected) {
            VoiceBase.textChannel = interaction.channel;
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(() => {
                interaction.editReply(AddCommand.addedReply(index - 1, true));
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