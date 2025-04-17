"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const CoolLoader_1 = require("../core/CoolLoader");
class QueueCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("queue")
            .setDescription("Lists the contents of the queue");
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
            VoiceBase.textChannel = interaction.channel;
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(() => {
                let queue = VoiceBase.queue.list();
                if (queue.length > 0) {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(":scroll: Queue (" + queue.length + " item" + (queue.length > 1 ? "s" : "") + (VoiceBase.repeat ? ", looping" : "") + ", " + Math.round(queue.filter((_, i) => i < 20).map((item) => {
                                return item['length'];
                            }).reduce((a, b) => {
                                return a + b;
                            }) / 60) + " minutes, done <t:" + (Math.round(new Date().getTime() / 1000) + Math.round(queue.filter((_, i) => i < 20).map((item) => {
                                return item['length'];
                            }).reduce((a, b) => {
                                return a + b;
                            }))) + ":t>)")
                                .setDescription(queue.filter((_, i) => i < 20).map((item, index) => {
                                // @ts-ignore
                                return "`" + ((index + 1) < 10 ? "0" + (index + 1) : (index + 1)) + ".` (`" + new Date(item.length * 1000).toISOString().substring(14, 19) + "`) [" + item.author + " - " + item.title + "](" + item.url + ")";
                            }).join("\n") + (queue.length > 20 ? "\nand " + (queue.length - 20) + " other item" + (queue.length - 20 > 1 ? "s" : "") : ""))
                        ]
                    });
                }
                else {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":x: The queue is empty, please use `/add`.")
                        ]
                    });
                }
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
exports.QueueCommand = QueueCommand;
//# sourceMappingURL=queue.js.map