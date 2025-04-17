"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InactivityTimer = void 0;
const discord_js_1 = require("discord.js");
const LogManager_1 = require("./LogManager");
class InactivityTimer {
    static trigger() {
        if (InactivityTimer.inactivityStartDate && new Date().getTime() - InactivityTimer.inactivityStartDate >= 1800000) {
            let VoiceBase = global.VoiceBase;
            if (VoiceBase.connection && VoiceBase.connected) {
                LogManager_1.LogManager.warn("Disconnecting bot after inactivity");
                if (VoiceBase.player)
                    VoiceBase.player.stop();
                VoiceBase.connection.disconnect();
                VoiceBase.connected = false;
                VoiceBase.playing = false;
                VoiceBase.autodj = false;
                VoiceBase.paused = false;
                VoiceBase.repeat = false;
VoiceBase.repeatOnce = false;
                VoiceBase.connection = null;
                if (VoiceBase.textChannel) {
                    VoiceBase.textChannel.send({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":warning: The bot has been inactive for 30 minutes and has left the channel.")
                        ], components: [
                            new discord_js_1.MessageActionRow()
                                .addComponents(new discord_js_1.MessageButton()
                                .setCustomId('{"command":"join","args":{}}')
                                .setLabel('Join')
                                .setStyle('SECONDARY'))
                        ]
                    });
                }
                VoiceBase.textChannel = null;
                VoiceBase.voiceChannel = null;
                VoiceBase.queue.flush();
            }
        }
    }
    static start() {
        LogManager_1.LogManager.warn("Started inactivity timer");
        InactivityTimer.inactivityStartDate = new Date().getTime();
    }
    static stop() {
        LogManager_1.LogManager.warn("Interrupted inactivity timer");
        InactivityTimer.inactivityStartDate = null;
    }
    static running() {
        return !!InactivityTimer.inactivityStartDate;
    }
}
exports.InactivityTimer = InactivityTimer;
//# sourceMappingURL=InactivityTimer.js.map