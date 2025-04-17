import {LogManager} from "./LogManager";

const Genius = require('genius-lyrics');
const Client = new Genius.Client();

export class LyricsGrabber {
    public static async grab(title: string, author: string): Promise<string> {
        try {
            LogManager.info("Lyrics: " + author.toLowerCase().split(",")[0] + " " + title.toLowerCase());
            const searches = await Client.songs.search(author.toLowerCase().split(",")[0] + " " + title.toLowerCase());
            const firstSong = searches[0];
            return (await firstSong.lyrics()).replaceAll("*", "\\*").replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[").replaceAll("|", "\\|").replaceAll("_", "\\_");
        } catch (e) {
            console.error(e);
            return "*No lyrics found for this song*";
        }
    }
}