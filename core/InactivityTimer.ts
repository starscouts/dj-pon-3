import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {LogManager} from "./LogManager";

export class InactivityTimer {
    static inactivityStartDate;

    public static trigger() {
        if (InactivityTimer.inactivityStartDate && new Date().getTime() - InactivityTimer.inactivityStartDate >= 1_800_000) {
            let VoiceBase = global.VoiceBase;

            if (VoiceBase.connection && VoiceBase.connected) {
                LogManager.warn("Disconnecting bot after inactivity");
                if (VoiceBase.player) VoiceBase.player.stop();
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
                            new MessageEmbed()
                                .setDescription(":warning: The bot has been inactive for 30 minutes and has left the channel.")
                        ], components: [
                            new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('{"command":"join","args":{}}')
                                        .setLabel('Join')
                                        .setStyle('SECONDARY'),
                                )
                        ]
                    })
                }

                VoiceBase.textChannel = null;
                VoiceBase.voiceChannel = null;
                VoiceBase.queue.flush();
            }
        }
    }

    public static start() {
        LogManager.warn("Started inactivity timer");
        InactivityTimer.inactivityStartDate = new Date().getTime();
    }

    public static stop() {
        LogManager.warn("Interrupted inactivity timer");
        InactivityTimer.inactivityStartDate = null;
    }

    public static running(): boolean {
        return !!InactivityTimer.inactivityStartDate;
    }
}