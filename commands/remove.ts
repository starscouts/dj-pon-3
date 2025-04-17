import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {CoolLoader} from "../core/CoolLoader";

export class RemoveCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("remove")
            .setDescription("Removes a song from the queue")
            .addStringOption(option =>
                option.setName('index')
                    .setDescription("Index of the song to remove")
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

        if (index < 2) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: To remove the currently playing song from the queue, use `/skip`.")
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
                let song = VoiceBase.queue.get(index - 1);
                VoiceBase.queue.remove(index - 1);
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":white_check_mark: Removed **[" + song.title + "](" + song.url + ")** from queue.")
                    ]
                });
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