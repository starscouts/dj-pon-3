import {QueueManager} from "./QueueManager";

export class VoiceBase {
    connection;
    resource;
    player;
    connected;
    playing;
    paused;
    repeat;
    autodj;
    repeatOnce;
    voiceChannel;
    textChannel;
    currentSong;
    queue;
    playStartDate;
    pauseStartDate;
    playingTimeBeforePause;

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
        this.queue = new QueueManager();
    }
}