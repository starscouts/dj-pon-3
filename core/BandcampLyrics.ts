import {Parser} from 'htmlparser2';
import axios from 'axios';
import {LogManager} from "./LogManager";

export class BandcampLyrics {
    public static async lyrics(url: string): Promise<string> {
        LogManager.info("Bandcamp lyrics: " + url);
        let song = (await axios.get(url)).data;

        let jsonFound = false;
        let jsonData = "";

        const parser = new Parser({
            onopentag(name, attributes) {
                if (name === "script" && attributes.type === "application/ld+json") {
                    jsonFound = true;
                }
            },
            ontext(text) {
                if (jsonFound) {
                    jsonData += text;
                }
            },
            onclosetag() {
                jsonFound = false;
            },
        });
        parser.write(song);
        parser.end();

        let data = JSON.parse(jsonData);
        let lyrics;

        try {
            lyrics = data.recordingOf.lyrics.text;
        } catch (e) {
            lyrics = "*No lyrics found*";
        }

        return lyrics;
    }
}