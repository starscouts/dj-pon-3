import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {LogManager} from "../core/LogManager";
import {CoolLoader} from "../core/CoolLoader";
import {CommandInteractionManager} from "../core/CommandInteractionManager";

export class LoopCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("autodj")
            .setDescription("Toggles Auto DJ")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.connected) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(() => {
                if (VoiceBase.autodj) {
                    let items = global.playbackHistory.map((i) => {
                        return i.url;
                    });
                    let item = items[Math.floor(Math.random() * items.length)];
                    CommandInteractionManager.commands["add"].handle(new CommandAction("add", interaction, {"query": item}), true).then(() => {
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(":robot: Auto DJ is already enabled, run `/stop` to disable it.")
                            ]
                        }).then(() => {
                            LogManager.info("/autodj: Auto DJ already enabled");
                        });
                    });
                } else {
                    VoiceBase.autodj = true;

                    let items = global.playbackHistory.map((i) => {
                        return i.url;
                    });
                    let item = items[Math.floor(Math.random() * items.length)];
                    CommandInteractionManager.commands["add"].handle(new CommandAction("add", interaction, {"query": item}), true).then(() => {
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(":robot: Auto DJ is now enabled, run `/stop` to disable it.")
                            ]
                        }).then(() => {
                            LogManager.info("/autodj: Auto DJ enabled");
                        });
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