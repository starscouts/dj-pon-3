import {InteractionManager} from "./InteractionManager";
import {ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} from "discord.js";
import {LogManager} from "./LogManager";

export class QueueModalCreator extends InteractionManager {
    constructor(interaction: ButtonInteraction) {
        super();
        LogManager.verbose("QueueModalCreator");

        let VoiceBase = global.VoiceBase;

        if (VoiceBase.connected) {
            const modal = new Modal()
                .setCustomId('queueModal')
                .setTitle('Add a new song to the queue');

            const queryInput = new TextInputComponent()
                .setCustomId('queryInput')
                .setLabel("Search query or song URL")
                .setStyle('SHORT')
                .setRequired(true)
                .setPlaceholder("e.g.: pw 4efb well get through")
                .setMinLength(1)
                .setMaxLength(100);
            const firstActionRow = new MessageActionRow().addComponents(queryInput);
            // @ts-ignore
            modal.addComponents(firstActionRow);

            interaction.showModal(modal);
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ],
                components: [
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