"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const CoolLoader_1 = require("../core/CoolLoader");
class StopCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("stop")
            .setDescription("Stops the bot from playing");
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.connected) {
            interaction.reply({ embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ] }).then(() => {
                if (VoiceBase.player)
                    VoiceBase.player.stop();
                VoiceBase.connection.disconnect();
                VoiceBase.connected = false;
                VoiceBase.playing = false;
                VoiceBase.paused = false;
                VoiceBase.repeat = false;
VoiceBase.repeatOnce = false;
                VoiceBase.autodj = false;
                VoiceBase.connection = null;
                VoiceBase.textChannel = null;
                VoiceBase.voiceChannel = null;
                VoiceBase.queue.flush();
                interaction.editReply({ embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":white_check_mark: Stopped the bot.")
                    ] });
            });
        }
        else {
            interaction.reply({ embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ], components: [
                    new discord_js_1.MessageActionRow()
                        .addComponents(new discord_js_1.MessageButton()
                        .setCustomId('{"command":"join","args":{}}')
                        .setLabel('Join')
                        .setStyle('SECONDARY'))
                ] });
        }
    }
}
exports.StopCommand = StopCommand;
//# sourceMappingURL=stop.js.map