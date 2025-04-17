import {Client} from "discord.js";

export class PresenceManager {
    public static start(client: Client): void {
        let VoiceBase = global.VoiceBase;
        setInterval(() => {
            if (!VoiceBase.playing) {
                client.user.setPresence({activities: [{name: '⏹ Stopped'}], status: 'online'});
            } else {
                if (VoiceBase.paused) {
                    client.user.setPresence({
                        activities: [{name: '⏸ ' + VoiceBase.queue.get(0).title}],
                        status: 'online'
                    });
                } else {
                    client.user.setPresence({
                        activities: [{name: '▶️ ' + VoiceBase.queue.get(0).title}],
                        status: 'online'
                    });
                }
            }
        }, 1000);
    }
}