"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
class PauseCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("pause")
            .setDescription("Pauses currently playing music");
    }
    handle(action) {
        let row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('{"_custom":"addModal"}')
            .setLabel('Add')
            .setStyle('SUCCESS'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"play","args":{}}')
            .setLabel('Play')
            .setStyle('PRIMARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"skip","args":{}}')
            .setLabel('Skip')
            .setStyle('PRIMARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"stop","args":{}}')
            .setLabel('Stop')
            .setStyle('DANGER'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"queue","args":{}}')
            .setLabel('View Queue')
            .setStyle('SECONDARY'));
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.connected) {
            if (!VoiceBase.playing) {
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":x: The bot is not playing.")
                    ],
                    components: [
                        new discord_js_1.MessageActionRow()
                            .addComponents(new discord_js_1.MessageButton()
                            .setCustomId('{"command":"play","args":{}}')
                            .setLabel('Play')
                            .setStyle('SECONDARY'))
                    ]
                });
                return;
            }
            if (VoiceBase.player.pause()) {
                VoiceBase.paused = true;
                VoiceBase.pauseStartDate = new Date();
                VoiceBase.playingTimeBeforePause = new Date().getTime() - VoiceBase.playStartDate.getTime();
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":pause_button: Paused.")
                    ], components: [row]
                });
            }
            else {
                interaction.reply(":x: Failed to pause, this is most likely a bug.");
            }
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
exports.PauseCommand = PauseCommand;
//# sourceMappingURL=pause.js.map