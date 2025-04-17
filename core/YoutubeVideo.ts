import {execFile as execFile_cb} from 'child_process';
import {promisify} from 'util';
import {tmpdir} from 'os';
import * as fs from 'fs';
import {LogManager} from "./LogManager";

const execFile = promisify(execFile_cb);

export class YoutubeVideo {
    public static async get(url: string, platform: string): Promise<string> {
        if (platform === "youtube" || platform === "bandcamp" || platform === "soundcloud") {
            LogManager.info("Song grabbing: yt-dlp");
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
            return data.url;
        } else if (platform === "argon") {
            LogManager.info("Song grabbing: argon");
            let id = url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-f\d]*)$/gm, "$3").trim();
            await execFile("wget", ["https://mediacdn.argon.minteck.org/" + id + "/high.elac", "-O", tmpdir() + "/argon-stream.elac"]);
            await execFile(__dirname + "/../../elac/elac-decode", [tmpdir() + "/argon-stream.elac"]);
            return tmpdir() + "/" + fs.readdirSync(tmpdir()).filter(i => i.startsWith("argon-stream") && i.endsWith(".wav"))[0];
        } else if (platform === "http") {
            LogManager.info("Song grabbing: http");
            return url;
        }
    }

    public static async search(query: string): Promise<string | null> {
        LogManager.info("YouTube search: " + query);

        try {
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", "--", "ytsearch:" + query])).stdout.toString());
            return data.original_url;
        } catch (e) {
            LogManager.info("No result to search query");
            return null;
        }
    }

    public static async search_soundcloud(query: string): Promise<string | null> {
        LogManager.info("SoundCloud search: " + query);

        try {
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", "--", "scsearch:" + query])).stdout.toString());
            return data.original_url;
        } catch (e) {
            LogManager.info("No result to search query");
            return null;
        }
    }
}
