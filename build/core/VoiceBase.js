"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceBase = void 0;
const QueueManager_1 = require("./QueueManager");
class VoiceBase {
    constructor() {
        this.connection = null;
        this.resource = null;
        this.player = null;
        this.connected = false;
        this.playing = false;
        this.paused = false;
        this.repeat = false;
        this.autodj = false;
        this.repeatOnce = false;
        this.voiceChannel = null;
        this.textChannel = null;
        this.currentSong = null;
        this.playStartDate = null;
        this.playingTimeBeforePause = null;
        this.pauseStartDate = null;
        this.queue = new QueueManager_1.QueueManager();
    }
}
exports.VoiceBase = VoiceBase;
//# sourceMappingURL=VoiceBase.js.map