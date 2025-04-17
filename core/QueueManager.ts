import axios from 'axios';
import {execFile as execFile_cb} from 'child_process';
import {promisify} from 'util';
import {basename} from 'path';
import * as fs from "fs";
import {MagicTitleParser} from "./MagicTitleParser";
import {tmpdir} from "os";
import {LogManager} from "./LogManager";
import {Cleanup} from "./Cleanup";

const execFile = promisify(execFile_cb);

class SongTooLongError extends Error {
    duration;

    constructor(message, duration) {
        super(message);
        this.name = "SongTooLongError";
        this.duration = duration;
    }
}

export class QueueManager {
    private queue;

    constructor() {
        this.queue = [];
    }

    public async add(url: string, author: number): Promise<object> {
        LogManager.info("Queue manager: add (youtube)")

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
        }

        let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
        let magic = MagicTitleParser.parse(data);
        queueItem.title = magic['title'];
        queueItem.author = magic['artist'];
        queueItem.length = parseInt(data.duration);
        try {
            queueItem.thumbnail = data.thumbnails[0].url;
        } catch (e) {
            queueItem.thumbnail = null;
        }

        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }

        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }

    public async add_bandcamp(url: string, author: number): Promise<object> {
        LogManager.info("Queue manager: add (bandcamp)")

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
        }

        let info = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
        queueItem.title = info.track;
        queueItem.author = info.artist;
        queueItem.length = info.duration;
        try {
            queueItem.thumbnail = info.thumbnails[0].url;
        } catch (e) {
            queueItem.thumbnail = null;
        }

        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }

        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }

    public async add_soundcloud(url: string, author: number): Promise<object> {
        LogManager.info("Queue manager: add (soundcloud)")

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
        }

        let info = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
        queueItem.title = info.title;
        queueItem.author = info.uploader;
        queueItem.length = info.duration;
        try {
            queueItem.thumbnail = info.thumbnails.sort((a, b) => b.width - a.width)[info.thumbnails.sort((a, b) => b.width - a.width).length - 1].url;
        } catch (e) {
            queueItem.thumbnail = null;
        }

        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }

        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }

    public async add_argon(url: string, author: number): Promise<object> {
        Cleanup.argonOnly();
        LogManager.info("Queue manager: add (argon)")

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
        }

        let id = url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-f\d]*)$/gm, "$3").trim();
        let meta = (await axios.get("https://forced.argon.minteck.org/api/get_list.php")).data;

        if (id.startsWith(":")) {
            throw new Error("Invalid Argon song ID");
        }

        if (!meta.songs[id]) {
            throw new Error("Song unavailable: " + id);
        }

        queueItem.title = meta.songs[id].name;
        queueItem.author = meta.songs[id].author + (meta.songs[id].original ? " [" + meta.songs[id].original + " cover]" : "");

        await execFile("wget", ["https://mediacdn.argon.minteck.org/" + id + "/high.elac", "-O", tmpdir() + "/argon-stream.elac"]);
        await execFile(__dirname + "/../../elac/elac-decode", [tmpdir() + "/argon-stream.elac"]);

        queueItem.length = Math.round(parseFloat(JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", tmpdir() + "/" + fs.readdirSync(tmpdir()).filter(i => i.startsWith("argon-stream") && i.endsWith(".wav"))])).stdout).streams[0].duration));
        queueItem.thumbnail = "https://forced.argon.minteck.org/api/get_image.php?_=" + id;

        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }

        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        fs.unlinkSync(tmpdir() + "/" + fs.readdirSync(tmpdir()).filter(i => i.startsWith("argon-stream") && i.endsWith(".wav")));
        fs.unlinkSync(tmpdir() + "/argon-stream.elac");
        return queueItem;
    }

    public async add_http(url: string, author: number): Promise<object> {
        LogManager.info("Queue manager: add (http)")

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
        }

        let parsed = new URL(url);
        if (!(parsed.hostname !== "localhost" && !parsed.hostname.startsWith("192.168.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("127.") && !parsed.hostname.startsWith("::") && !parsed.hostname.startsWith("localhost"))) {
            throw new Error("Invalid URL");
        }

        queueItem.title = basename(decodeURI(parsed.pathname));
        queueItem.author = parsed.hostname;
        queueItem.length = Math.round(parseFloat(JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", "--", url])).stdout).streams[0].duration));

        if (queueItem.length >= 600) {
            throw new SongTooLongError("Song too long", queueItem.length);
        }

        this.queue.push(queueItem);
        this.history(this.queue.length - 1);
        return queueItem;
    }

    public list(): object[] {
        return this.queue;
    }

    public get(index: number): object | null {
        if (this.queue[index]) {
            return this.queue[index];
        } else {
            return null;
        }
    }

    public remove(index: number): object | null {
        LogManager.info("Queue manager: remove")

        if (this.queue[index]) {
            let item = this.queue[index];
            this.queue.splice(index, 1);
            return item;
        } else {
            return null;
        }
    }

    public flush(): void {
        LogManager.info("Queue manager: flush")

        this.queue = [];
    }

    public shuffle(): void {
        LogManager.info("Queue manager: shuffle")

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
                queue[randomIndex], queue[currentIndex]];
        }

        if (global.VoiceBase.playing) {
            queue.unshift(firstItem);
        }
    }

    private history(index: number) {
        LogManager.info("Queue manager: add to history")

        let names = global.playbackHistory.map((i) => {
            return i.title;
        });
        let name = this.get(index)['author'] + " - " + this.get(index)['title'];
        let url = this.get(index)['url'];

        if (!names.includes(name)) {
            global.playbackHistory.push({
                title: name,
                url
            })
            fs.writeFileSync("data/history.json", JSON.stringify(global.playbackHistory));
        }
    }
}