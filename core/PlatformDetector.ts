import {execFile as execFile_cb} from 'child_process';
import {promisify} from 'util';

const execFile = promisify(execFile_cb);

export class PlatformDetector {
    public static async isYoutube(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)(www\.|)(youtube\.com\/watch\?v=[a-zA-Z\d-_]*|youtu\.be\/[a-zA-Z\d-_]*)$/gm);
    }

    public static async isYoutubePlaylist(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)(www\.|)(youtube\.com\/playlist\?list=[a-zA-Z\d-_]*)$/gm);
    }

    public static async isArgon(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/[a-f\d]*$/gm);
    }

    public static async isArgonAlbum(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/[a-z\d\-_.]*$/gm);
    }

    public static async isBandcamp(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)[a-z\d\-_]*\.bandcamp\.com\/track\/[a-z\d\-_]*$/gm);
    }

    public static async isBandcampAlbum(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)[a-z\d\-_]*\.bandcamp\.com\/album\/[a-z\d\-_]*$/gm);
    }

    public static async isSoundcloud(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)(www\.|api-v2\.|)soundcloud\.com\/[a-z\d\-_]*\/[a-z\d\-_]*$/gm);
    }

    public static async isSoundcloudSet(query: string): Promise<boolean> {
        return !!query.match(/^(http(s|):\/\/)(www\.|)soundcloud\.com\/[a-z\d\-_]*\/sets\/[a-z\d\-_]*$/gm);
    }

    public static async isHTTP(query: string): Promise<boolean> {
        try {
            let parsed = new URL(query);
            if (!(parsed.hostname !== "localhost" && !parsed.hostname.startsWith("192.168.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("127.") && !parsed.hostname.startsWith("::") && !parsed.hostname.startsWith("localhost"))) {
                return false;
            }
            let data = JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", "--", query])).stdout.toString());
            return !!data.streams[0].duration;
        } catch (e) {
            return false;
        }
    }

    public static async isHTTPStream(query: string): Promise<boolean> {
        try {
            let parsed = new URL(query);
            if (!(parsed.hostname !== "localhost" && !parsed.hostname.startsWith("192.168.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("10.") && !parsed.hostname.startsWith("127.") && !parsed.hostname.startsWith("::") && !parsed.hostname.startsWith("localhost"))) {
                return false;
            }
            let data = JSON.parse((await execFile("ffprobe", ["-v", "quiet", "-show_entries", "stream", "-print_format", "json", "--", query])).stdout.toString());
            return !data.streams[0].duration;
        } catch (e) {
            return false;
        }
    }
}