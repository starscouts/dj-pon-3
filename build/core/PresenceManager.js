"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceManager = void 0;
class PresenceManager {
    static start(client) {
        let VoiceBase = global.VoiceBase;
        setInterval(() => {
            if (!VoiceBase.playing) {
                client.user.setPresence({ activities: [{ name: '⏹ Stopped' }], status: 'online' });
            }
            else {
                if (VoiceBase.paused) {
                    client.user.setPresence({
                        activities: [{ name: '⏸ ' + VoiceBase.queue.get(0).title }],
                        status: 'online'
                    });
                }
                else {
                    client.user.setPresence({
                        activities: [{ name: '▶️ ' + VoiceBase.queue.get(0).title }],
                        status: 'online'
                    });
                }
            }
        }, 1000);
    }
}
exports.PresenceManager = PresenceManager;
//# sourceMappingURL=PresenceManager.js.map