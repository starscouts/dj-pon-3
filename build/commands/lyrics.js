"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricsCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const LyricsGrabber_1 = require("../core/LyricsGrabber");
const BandcampLyrics_1 = require("../core/BandcampLyrics");
const axios_1 = __importDefault(require("axios"));
const CoolLoader_1 = require("../core/CoolLoader");
class LyricsCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("lyrics")
            .setDescription("Displays lyrics of the currently playing song");
    }
    handle(action) {
        let row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('{"_custom":"addModal"}')
            .setLabel('Add')
            .setStyle('SUCCESS'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"play","args":{}}')
            .setLabel('Play')
            .setStyle('PRIMARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"skip","args":{}}')
            .setLabel('Skip')
            .setStyle('PRIMARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"queue","args":{}}')
            .setLabel('View Queue')
            .setStyle('SECONDARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"lyrics","args":{}}')
            .setLabel('View Lyrics')
            .setStyle('SECONDARY'));
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (VoiceBase.connected) {
            if (!VoiceBase.playing) {
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":x: The bot is not playing.")
                    ],
                    components: [
                        new discord_js_1.MessageActionRow()
                            .addComponents(new discord_js_1.MessageButton()
                            .setCustomId('{"command":"play","args":{}}')
                            .setLabel('Play')
                            .setStyle('SECONDARY'))
                    ]
                });
                return;
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(async () => {
                if (VoiceBase.queue.get(0).source === "bandcamp") {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setTitle(":notes: Lyrics")
                                .setDescription(await BandcampLyrics_1.BandcampLyrics.lyrics(VoiceBase.queue.get(0).url))
                                .setFooter({
                                text: "Data provided by Bandcamp"
                            })
                        ], components: [row]
                    });
                }
                else if (VoiceBase.queue.get(0).source === "argon") {
                    axios_1.default.get("https://forced.argon.minteck.org/api/get_list.php").then((raw) => {
                        let meta = raw.data;
                        let id = VoiceBase.queue.get(0).url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-f\d]*)$/gm, "$3").trim();
                        if (meta.songs[id] && meta.songs[id].lyrics) {
                            interaction.editReply({
                                embeds: [
                                    new discord_js_1.MessageEmbed()
                                        .setTitle(":notes: Lyrics")
                                        .setDescription(meta.songs[id].lyrics.replaceAll("*", "\\*").replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[").replaceAll("|", "\\|").replaceAll("_", "\\_").replace(/<(\/|)[a-z]*>/gm, ""))
                                        .setFooter({
                                        text: "Data provided by Argon"
                                    })
                                ], components: [row]
                            });
                        }
                        else {
                            let title;
                            if (meta.songs[id].original) {
                                title = meta.songs[id].original + " - " + meta.songs[id].name;
                            }
                            else {
                                title = meta.songs[id].author + " - " + meta.songs[id].name;
                            }
                            LyricsGrabber_1.LyricsGrabber.grab(title, "").then((lyrics) => {
                                interaction.editReply({
                                    embeds: [
                                        new discord_js_1.MessageEmbed()
                                            .setTitle(":notes: Lyrics")
                                            .setDescription(lyrics)
                                            .setFooter({
                                            text: "Data provided by Genius"
                                        })
                                    ], components: [row]
                                });
                            });
                        }
                    });
                }
                else {
                    LyricsGrabber_1.LyricsGrabber.grab(VoiceBase.queue.get(0).title, VoiceBase.queue.get(0).author).then((lyrics) => {
                        interaction.editReply({
                            embeds: [
                                new discord_js_1.MessageEmbed()
                                    .setTitle(":notes: Lyrics")
                                    .setDescription(lyrics)
                                    .setFooter({
                                    text: "Data provided by Genius"
                                })
                            ], components: [row]
                        });
                    });
                }
            });
        }
        else {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ], components: [
                    new discord_js_1.MessageActionRow()
                        .addComponents(new discord_js_1.MessageButton()
                        .setCustomId('{"command":"join","args":{}}')
                        .setLabel('Join')
                        .setStyle('SECONDARY'))
                ]
            });
        }
    }
}
exports.LyricsCommand = LyricsCommand;
//# sourceMappingURL=lyrics.js.map