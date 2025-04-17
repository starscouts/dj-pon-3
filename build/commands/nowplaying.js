"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowPlayingCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const builders_1 = require("@discordjs/builders");
const play_1 = require("./play");
const discord_js_1 = require("discord.js");
class NowPlayingCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("nowplaying")
            .setDescription("Shows info about the currently playing song");
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.playing) {
            interaction.reply(play_1.PlayCommand.nowPlaying(0));
        }
        else {
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
        }
    }
}
exports.NowPlayingCommand = NowPlayingCommand;
//# sourceMappingURL=nowplaying.js.map