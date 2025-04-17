"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicTitleParser = void 0;
const LogManager_1 = require("./LogManager");
class MagicTitleParser {
    static parse(metadata) {
        let partists = (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']).replace(/^([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)-(.*)/gm, "$1") !== (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']) ? (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']).replace(/^([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)-(.*)/gm, "$1") : "";
        let partists2 = (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']).replace(/(.*)\((feat|ft|with)(\.|:| |)(| |)([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)\)(.*)/gmi, "$5") !== (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']) ? (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']).replace(/(.*)\((feat|ft|with)(\.|:| |)(| |)([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)\)(.*)/gmi, "$5") : "";
        let artistsList = Array.from(new Set([...(metadata['artist'] ?? metadata['creator'] ?? metadata['uploader']).replace(/(, |,|and |And |&)/gm, "|").split("|").map(i => i.trim()), ...partists.replace(/(, |,|and |And |&)/gm, "|").split("|").map(i => i.trim()), ...partists2.replace(/(, |,|and |And |&)/gm, "|").split("|").map(i => i.trim())])).filter(i => i.trim() !== "");
        let songTitle = (metadata['track'] ?? metadata['alt_title'] ?? metadata['title']).replace(/^([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)-( |)(.*)(\[(.*)\]|)/gm, "$3").replace(/(.*)\((feat|ft|with)(\.|:| |)(| |)([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)\)(.*)/gmi, "$1").replace(/(.*)\[(.*)\](.*)/gm, "$1").replace(/(.*)\((from|in|by|Official)(\.|:| |)(| |)([:\"'a-zA-Z0-9 .\-*\_\/\\,&]*)\)(.*)/gmi, "$1").trim();
        LogManager_1.LogManager.info("Parsed title: " + artistsList.join(", ") + " - " + songTitle);
        return {
            full: artistsList.join(", ") + " - " + songTitle,
            artist: artistsList.join(", "),
            artists: artistsList,
            title: songTitle
        };
    }
}
exports.MagicTitleParser = MagicTitleParser;
//# sourceMappingURL=MagicTitleParser.js.map