"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const LogManager_1 = require("../core/LogManager");
const CoolLoader_1 = require("../core/CoolLoader");
class LoopCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("loop")
            .setDescription("Toggles repeating the entire queue");
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
                VoiceBase.repeat = !VoiceBase.repeat;
                if (VoiceBase.repeat) {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":repeat: Repeat mode is **on**.")
                        ]
                    }).then(() => {
                        LogManager_1.LogManager.info("/loop: repeat mode enabled");
                    });
                }
                else {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":arrow_right_hook: Repeat mode is **off**.")
                        ]
                    }).then(() => {
                        LogManager_1.LogManager.info("/loop: repeat mode disabled");
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
exports.LoopCommand = LoopCommand;
//# sourceMappingURL=loop.js.map