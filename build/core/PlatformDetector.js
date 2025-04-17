"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformDetector = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFile = (0, util_1.promisify)(child_process_1.execFile);
class PlatformDetector {
    static async isYoutube(query) {
        return !!query.match(/^(http(s|):\/\/)(www\.|)(youtube\.com\/watch\?v=[a-zA-Z\d-_]*|youtu\.be\/[a-zA-Z\d-_]*)$/gm);
    }
    static async isYoutubePlaylist(query) {
        return !!query.match(/^(http(s|):\/\/)(www\.|)(youtube\.com\/playlist\?list=[a-zA-Z\d-_]*)$/gm);
    }
    static async isArgon(query) {
        return !!query.match(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/[a-f\d]*$/gm);
    }
    static async isArgonAlbum(query) {
        return !!query.match(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/[a-z\d\-_.]*$/gm);
    }
    static async isBandcamp(query) {
        return !!query.match(/^(http(s|):\/\/)[a-z\d\-_]*\.bandcamp\.com\/track\/[a-z\d\-_]*$/gm);
    }
    static async isBandcampAlbum(query) {
        return !!query.match(/^(http(s|):\/\/)[a-z\d\-_]*\.bandcamp\.com\/album\/[a-z\d\-_]*$/gm);
    }
    static async isSoundcloud(query) {
        return !!query.match(/^(http(s|):\/\/)(www\.|api-v2\.|)soundcloud\.com\/[a-z\d\-_]*\/[a-z\d\-_]*$/gm);
    }
    static async isSoundcloudSet(query) {
        return !!query.match(/^(http(s|):\/\/)(www\.|)soundcloud\.com\/[a-z\d\-_]*\/sets\/[a-z\d\-_]*$/gm);
    }
    static async isHTTP(query) {
        try {
            let parsed = new URL(query);
            if (!(parsed.hostname !== "localhost" && !parsed.hostname.startsWith("192.168.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("127.") && !parsed.hostname.startsWith("::") && !parsed.hostname.startsWith("localhost"))) {
                return false;
            }
            let data = JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", "--", query])).stdout.toString());
            return !!data.streams[0].duration;
        }
        catch (e) {
            return false;
        }
    }
    static async isHTTPStream(query) {
        try {
            let parsed = new URL(query);
            if (!(parsed.hostname !== "localhost" && !parsed.hostname.startsWith("192.168.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("127.") && !parsed.hostname.startsWith("::") && !parsed.hostname.startsWith("localhost"))) {
                return false;
            }
            let data = JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", "--", query])).stdout.toString());
            return !data.streams[0].duration;
        }
        catch (e) {
            return false;
        }
    }
}
exports.PlatformDetector = PlatformDetector;
//# sourceMappingURL=PlatformDetector.js.map