"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const CommandAction_1 = require("../core/CommandAction");
const LogManager_1 = require("../core/LogManager");
const CoolLoader_1 = require("../core/CoolLoader");
const CommandInteractionManager_1 = require("../core/CommandInteractionManager");
class LoopCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("autodj")
            .setDescription("Toggles Auto DJ");
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.connected) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(() => {
                if (VoiceBase.autodj) {
                    let items = global.playbackHistory.map((i) => {
                        return i.url;
                    });
                    let item = items[Math.floor(Math.random() * items.length)];
                    CommandInteractionManager_1.CommandInteractionManager.commands["add"].handle(new CommandAction_1.CommandAction("add", interaction, { "query": item }), true).then(() => {
                        interaction.editReply({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setDescription(":robot: Auto DJ is already enabled, run `/stop` to disable it.")
                            ]
                        }).then(() => {
                            LogManager_1.LogManager.info("/autodj: Auto DJ already enabled");
                        });
                    });
                }
                else {
                    VoiceBase.autodj = true;
                    let items = global.playbackHistory.map((i) => {
                        return i.url;
                    });
                    let item = items[Math.floor(Math.random() * items.length)];
                    CommandInteractionManager_1.CommandInteractionManager.commands["add"].handle(new CommandAction_1.CommandAction("add", interaction, { "query": item }), true).then(() => {
                        interaction.editReply({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setDescription(":robot: Auto DJ is now enabled, run `/stop` to disable it.")
                            ]
                        }).then(() => {
                            LogManager_1.LogManager.info("/autodj: Auto DJ enabled");
                        });
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
//# sourceMappingURL=autodj.js.map