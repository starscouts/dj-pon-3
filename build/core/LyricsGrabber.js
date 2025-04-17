"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricsGrabber = void 0;
const LogManager_1 = require("./LogManager");
const Genius = require('genius-lyrics');
const Client = new Genius.Client();
class LyricsGrabber {
    static async grab(title, author) {
        try {
            LogManager_1.LogManager.info("Lyrics: " + author.toLowerCase().split(",")[0] + " " + title.toLowerCase());
            const searches = await Client.songs.search(author.toLowerCase().split(",")[0] + " " + title.toLowerCase());
            const firstSong = searches[0];
            return (await firstSong.lyrics()).replaceAll("*", "\\*").replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[").replaceAll("|", "\\|").replaceAll("_", "\\_");
        }
        catch (e) {
            console.error(e);
            return "*No lyrics found for this song*";
        }
    }
}
exports.LyricsGrabber = LyricsGrabber;
//# sourceMappingURL=LyricsGrabber.js.map