"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipToCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const CommandAction_1 = require("../core/CommandAction");
const skip_1 = require("./skip");
const CoolLoader_1 = require("../core/CoolLoader");
class SkipToCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("skipto")
            .setDescription("Skips to a certain item in the queue")
            .addStringOption(option => option.setName('index')
            .setDescription("Index of the song to skip to")
            .setRequired(true));
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        // @ts-ignore
        let index = interaction.options.getString('index').trim() - 1 + 1;
        if (VoiceBase.autodj) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            });
            return;
        }
        if (isNaN(index) || !isFinite(index) || Math.round(index) !== index) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: Index needs to be a valid integer.")
                ]
            });
            return;
        }
        if (index < 2) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: To skip to the currently playing song, use `/replay`.")
                ]
            });
            return;
        }
        if (VoiceBase.queue.get(index - 1) === null) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: Unable to find the song at index " + index + ".")
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
                let song = VoiceBase.queue.get(index - 1);
                let pos = index - 2;
                while (pos > 0) {
                    VoiceBase.queue.remove(pos);
                    pos--;
                }
                let cmd = new skip_1.SkipCommand();
                cmd.handle(new CommandAction_1.CommandAction("skip", interaction), true);
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
exports.SkipToCommand = SkipToCommand;
//# sourceMappingURL=skipto.js.map