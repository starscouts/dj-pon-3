"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = void 0;
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const MagicTitleParser_1 = require("./MagicTitleParser");
const os_1 = require("os");
const LogManager_1 = require("./LogManager");
const Cleanup_1 = require("./Cleanup");
const execFile = (0, util_1.promisify)(child_process_1.execFile);
class SongTooLongError extends Error {
    constructor(message, duration) {
        super(message);
        this.name = "SongTooLongError";
        this.duration = duration;
    }
}
class QueueManager {
    constructor() {
        this.queue = [];
    }
    async add(url, author) {
        LogManager_1.LogManager.info("Queue manager: add (youtube)");
        let queueItem = {
            source: "youtube",
            title: null,
            author: null,
            length: null,
            thumbnail: null,
            index: this.queue.length,
            added_by: author,
            added_date: new Date(),
            url
        };
        let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
        let magic = MagicTitleParser_1.MagicTitleParser.parse(data);
        queueItem.title = magic['title'];
        queueItem.author = magic['artist'];
        queueItem.length = parseInt(data.duration);
        try {
            queueItem.thumbnail = data.thumbnails[0].url;
        }
        catch (e) {
            queueItem.thumbnail = null;
        }
        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }
        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }
    async add_bandcamp(url, author) {
        LogManager_1.LogManager.info("Queue manager: add (bandcamp)");
        let queueItem = {
            source: "bandcamp",
            title: null,
            author: null,
            length: null,
            thumbnail: null,
            index: this.queue.length,
            added_by: author,
            added_date: new Date(),
            url
        };
        let info = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
        queueItem.title = info.track;
        queueItem.author = info.artist;
        queueItem.length = info.duration;
        try {
            queueItem.thumbnail = info.thumbnails[0].url;
        }
        catch (e) {
            queueItem.thumbnail = null;
        }
        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }
        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }
    async add_soundcloud(url, author) {
        LogManager_1.LogManager.info("Queue manager: add (soundcloud)");
        let queueItem = {
            source: "soundcloud",
            title: null,
            author: null,
            length: null,
            thumbnail: null,
            index: this.queue.length,
            added_by: author,
            added_date: new Date(),
            url
        };
        let info = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
        queueItem.title = info.title;
        queueItem.author = info.uploader;
        queueItem.length = info.duration;
        try {
            queueItem.thumbnail = info.thumbnails.sort((a, b) => b.width - a.width)[info.thumbnails.sort((a, b) => b.width - a.width).length - 1].url;
        }
        catch (e) {
            queueItem.thumbnail = null;
        }
        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }
        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }
    async add_argon(url, author) {
        Cleanup_1.Cleanup.argonOnly();
        LogManager_1.LogManager.info("Queue manager: add (argon)");
        let queueItem = {
            source: "argon",
            title: null,
            author: null,
            length: null,
            thumbnail: null,
            index: this.queue.length,
            added_by: author,
            added_date: new Date(),
            url
        };
        let id = url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-f\d]*)$/gm, "$3").trim();
        let meta = (await axios_1.default.get("https://forced.argon.minteck.org/api/get_list.php")).data;
        if (id.startsWith(":")) {
            throw new Error("Invalid Argon song ID");
        }
        if (!meta.songs[id]) {
            throw new Error("Song unavailable: " + id);
        }
        queueItem.title = meta.songs[id].name;
        queueItem.author = meta.songs[id].author + (meta.songs[id].original ? " [" + meta.songs[id].original + " cover]" : "");
        await execFile("wget", ["https://mediacdn.argon.minteck.org/" + id + "/high.elac", "-O", (0, os_1.tmpdir)() + "/argon-stream.elac"]);
        await execFile(__dirname + "/../../elac/elac-decode", [(0, os_1.tmpdir)() + "/argon-stream.elac"]);
        queueItem.length = Math.round(parseFloat(JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", (0, os_1.tmpdir)() + "/" + fs.readdirSync((0, os_1.tmpdir)()).filter(i => i.startsWith("argon-stream") && i.endsWith(".wav"))])).stdout).streams[0].duration));
        queueItem.thumbnail = "https://forced.argon.minteck.org/api/get_image.php?_=" + id;
        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }
        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        fs.unlinkSync((0, os_1.tmpdir)() + "/" + fs.readdirSync((0, os_1.tmpdir)()).filter(i => i.startsWith("argon-stream") && i.endsWith(".wav")));
        fs.unlinkSync((0, os_1.tmpdir)() + "/argon-stream.elac");
        return queueItem;
    }
    async add_http(url, author) {
        LogManager_1.LogManager.info("Queue manager: add (http)");
        let queueItem = {
            source: "http",
            title: null,
            author: null,
            length: null,
            thumbnail: null,
            index: this.queue.length,
            added_by: author,
            added_date: new Date(),
            url: encodeURI(decodeURI(url))
        };
        let parsed = new URL(url);
        if (!(parsed.hostname !== "localhost" && !parsed.hostname.startsWith("192.168.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("127.") && !parsed.hostname.startsWith("::") && !parsed.hostname.startsWith("localhost"))) {
            throw new Error("Invalid URL");
        }
        queueItem.title = (0, path_1.basename)(decodeURI(parsed.pathname));
        queueItem.author = parsed.hostname;
        queueItem.length = Math.round(parseFloat(JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", "--", url])).stdout).streams[0].duration));
        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }
        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }
    list() {
        return this.queue;
    }
    get(index) {
        if (this.queue[index]) {
            return this.queue[index];
        }
        else {
            return null;
        }
    }
    remove(index) {
        LogManager_1.LogManager.info("Queue manager: remove");
        if (this.queue[index]) {
            let item = this.queue[index];
            this.queue.splice(index, 1);
            return item;
        }
        else {
            return null;
        }
    }
    flush() {
        LogManager_1.LogManager.info("Queue manager: flush");
        this.queue = [];
    }
    shuffle() {
        LogManager_1.LogManager.info("Queue manager: shuffle");
        let queue = this.queue;
        let firstItem;
        if (global.VoiceBase.playing) {
            firstItem = queue[0];
            queue.shift();
        }
        let currentIndex = queue.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [queue[currentIndex], queue[randomIndex]] = [
                queue[randomIndex], queue[currentIndex]
            ];
        }
        if (global.VoiceBase.playing) {
            queue.unshift(firstItem);
        }
    }
    history(index) {
        LogManager_1.LogManager.info("Queue manager: add to history");
        let names = global.playbackHistory.map((i) => {
            return i.title;
        });
        let name = this.get(index)['author'] + " - " + this.get(index)['title'];
        let url = this.get(index)['url'];
        if (!names.includes(name)) {
            global.playbackHistory.push({
                title: name,
                url
            });
            fs.writeFileSync("data/history.json", JSON.stringify(global.playbackHistory));
        }
    }
}
exports.QueueManager = QueueManager;
//# sourceMappingURL=QueueManager.js.map