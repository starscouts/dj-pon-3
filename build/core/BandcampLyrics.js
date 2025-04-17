"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandcampLyrics = void 0;
const htmlparser2_1 = require("htmlparser2");
const axios_1 = __importDefault(require("axios"));
const LogManager_1 = require("./LogManager");
class BandcampLyrics {
    static async lyrics(url) {
        LogManager_1.LogManager.info("Bandcamp lyrics: " + url);
        let song = (await axios_1.default.get(url)).data;
        let jsonFound = false;
        let jsonData = "";
        const parser = new htmlparser2_1.Parser({
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
        }
        catch (e) {
            lyrics = "*No lyrics found*";
        }
        return lyrics;
    }
}
exports.BandcampLyrics = BandcampLyrics;
//# sourceMappingURL=BandcampLyrics.js.map