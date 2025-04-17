"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const play_1 = require("./play");
const CoolLoader_1 = require("../core/CoolLoader");
class ReplayCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("replay")
            .setDescription("Restarts playing the current track");
    }
    handle(action) {
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
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(() => {
                VoiceBase.playing = false;
                try {
                    clearInterval(global.waitUntilDoneInterval);
                }
                catch (e) {
                }
                let cmd = new play_1.PlayCommand();
                cmd.play(interaction, true);
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
exports.ReplayCommand = ReplayCommand;
//# sourceMappingURL=replay.js.map