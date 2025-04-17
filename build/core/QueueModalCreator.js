"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModalCreator = void 0;
const InteractionManager_1 = require("./InteractionManager");
const discord_js_1 = require("discord.js");
const LogManager_1 = require("./LogManager");
class QueueModalCreator extends InteractionManager_1.InteractionManager {
    constructor(interaction) {
        super();
        LogManager_1.LogManager.verbose("QueueModalCreator");
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.connected) {
            const modal = new discord_js_1.Modal()
                .setCustomId('queueModal')
                .setTitle('Add a new song to the queue');
            const queryInput = new discord_js_1.TextInputComponent()
                .setCustomId('queryInput')
                .setLabel("Search query or song URL")
                .setStyle('SHORT')
                .setRequired(true)
                .setPlaceholder("e.g.: pw 4efb well get through")
                .setMinLength(1)
                .setMaxLength(100);
            const firstActionRow = new discord_js_1.MessageActionRow().addComponents(queryInput);
            // @ts-ignore
            modal.addComponents(firstActionRow);
            interaction.showModal(modal);
        }
        else {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ],
                components: [
                    new discord_js_1.MessageActionRow()
                        .addComponents(new discord_js_1.MessageButton()
                        .setCustomId('{"command":"join","args":{}}')
                        .setLabel('Join')
                        .setStyle('SECONDARY'))
                ]
            });
        }
    }
}
exports.QueueModalCreator = QueueModalCreator;
//# sourceMappingURL=QueueModalCreator.js.map