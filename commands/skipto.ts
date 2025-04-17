import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {SkipCommand} from "./skip";
import {CoolLoader} from "../core/CoolLoader";

export class SkipToCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("skipto")
            .setDescription("Skips to a certain item in the queue")
            .addStringOption(option =>
                option.setName('index')
                    .setDescription("Index of the song to skip to")
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
                        .setDescription(":x: To skip to the currently playing song, use `/replay`.")
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
                let pos = index - 2;

                while (pos > 0) {
                    VoiceBase.queue.remove(pos);
                    pos--;
                }

                let cmd = new SkipCommand();
                cmd.handle(new CommandAction("skip", interaction), true);
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