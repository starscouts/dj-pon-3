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
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeVideo = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const os_1 = require("os");
const fs = __importStar(require("fs"));
const LogManager_1 = require("./LogManager");
const execFile = (0, util_1.promisify)(child_process_1.execFile);
class YoutubeVideo {
    static async get(url, platform) {
        if (platform === "youtube" || platform === "bandcamp" || platform === "soundcloud") {
            LogManager_1.LogManager.info("Song grabbing: yt-dlp");
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", url])).stdout.toString());
            return data.url;
        }
        else if (platform === "argon") {
            LogManager_1.LogManager.info("Song grabbing: argon");
            let id = url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-f\d]*)$/gm, "$3").trim();
            await execFile("wget", ["https://mediacdn.argon.minteck.org/" + id + "/high.elac", "-O", (0, os_1.tmpdir)() + "/argon-stream.elac"]);
            await execFile(__dirname + "/../../elac/elac-decode", [(0, os_1.tmpdir)() + "/argon-stream.elac"]);
            return (0, os_1.tmpdir)() + "/" + fs.readdirSync((0, os_1.tmpdir)()).filter(i => i.startsWith("argon-stream") && i.endsWith(".wav"))[0];
        }
        else if (platform === "http") {
            LogManager_1.LogManager.info("Song grabbing: http");
            return url;
        }
    }
    static async search(query) {
        LogManager_1.LogManager.info("YouTube search: " + query);
        try {
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", "--", "ytsearch:" + query])).stdout.toString());
            return data.original_url;
        }
        catch (e) {
            LogManager_1.LogManager.info("No result to search query");
            return null;
        }
    }
    static async search_soundcloud(query) {
        LogManager_1.LogManager.info("SoundCloud search: " + query);
        try {
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", "--", "scsearch:" + query])).stdout.toString());
            return data.original_url;
        }
        catch (e) {
            LogManager_1.LogManager.info("No result to search query");
            return null;
        }
    }
}
exports.YoutubeVideo = YoutubeVideo;
//# sourceMappingURL=YoutubeVideo.js.map