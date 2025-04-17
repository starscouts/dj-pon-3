"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopOneCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const LogManager_1 = require("../core/LogManager");
const CoolLoader_1 = require("../core/CoolLoader");
class LoopOneCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("loopone")
            .setDescription("Toggles repeating the current song");
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
                VoiceBase.repeatOnce = !VoiceBase.repeatOnce;
                if (VoiceBase.repeatOnce) {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":repeat: Song repeat mode is **on**.")
                        ]
                    }).then(() => {
                        LogManager_1.LogManager.info("/loopone: song repeat mode enabled");
                    });
                }
                else {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":arrow_right_hook: Song repeat mode is **off**.")
                        ]
                    }).then(() => {
                        LogManager_1.LogManager.info("/loopone: song repeat mode disabled");
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
exports.LoopOneCommand = LoopOneCommand;
//# sourceMappingURL=loopone.js.map