"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuffleCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const CoolLoader_1 = require("../core/CoolLoader");
class ShuffleCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("shuffle")
            .setDescription("Randomly changes the queue's order");
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.autodj) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            });
            return;
        }
        if (VoiceBase.connected) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(() => {
                VoiceBase.queue.shuffle();
                interaction.editReply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":white_check_mark: Randomly mixed the queue's order")
                    ], components: [
                        new discord_js_1.MessageActionRow()
                            .addComponents(new discord_js_1.MessageButton()
                            .setCustomId('{"command":"play","args":{}}')
                            .setLabel('Play')
                            .setStyle('PRIMARY')
                            .setDisabled(global.VoiceBase.playing), new discord_js_1.MessageButton()
                            .setCustomId('{"_custom":"addModal"}')
                            .setLabel('Add')
                            .setStyle('SUCCESS'), new discord_js_1.MessageButton()
                            .setCustomId('{"command":"queue","args":{}}')
                            .setLabel('View Queue')
                            .setStyle('SECONDARY'))
                    ]
                });
            });
        }
        else {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ], components: [
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
exports.ShuffleCommand = ShuffleCommand;
//# sourceMappingURL=shuffle.js.map