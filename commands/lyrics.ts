import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {LyricsGrabber} from "../core/LyricsGrabber";
import {BandcampLyrics} from "../core/BandcampLyrics";
import axios from "axios";
import {CoolLoader} from "../core/CoolLoader";

export class LyricsCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("lyrics")
            .setDescription("Displays lyrics of the currently playing song")
    }

    public handle(action: CommandAction) {
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('{"_custom":"addModal"}')
                    .setLabel('Add')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('{"command":"play","args":{}}')
                    .setLabel('Play')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('{"command":"skip","args":{}}')
                    .setLabel('Skip')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('{"command":"queue","args":{}}')
                    .setLabel('View Queue')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('{"command":"lyrics","args":{}}')
                    .setLabel('View Lyrics')
                    .setStyle('SECONDARY'),
            );

        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.connected) {
            if (!VoiceBase.playing) {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":x: The bot is not playing.")
                    ],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('{"command":"play","args":{}}')
                                    .setLabel('Play')
                                    .setStyle('SECONDARY'),
                            )
                    ]
                });
                return;
            }

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(async () => {
                if (VoiceBase.queue.get(0).source === "bandcamp") {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(":notes: Lyrics")
                                .setDescription(await BandcampLyrics.lyrics(VoiceBase.queue.get(0).url))
                                .setFooter({
                                    text: "Data provided by Bandcamp"
                                })
                        ], components: [row]
                    })
                } else if (VoiceBase.queue.get(0).source === "argon") {
                    axios.get("https://forced.argon.minteck.org/api/get_list.php").then((raw) => {
                        let meta = raw.data;
                        let id = VoiceBase.queue.get(0).url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-f\d]*)$/gm, "$3").trim();
                        if (meta.songs[id] && meta.songs[id].lyrics) {
                            interaction.editReply({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(":notes: Lyrics")
                                        .setDescription(meta.songs[id].lyrics.replaceAll("*", "\\*").replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[").replaceAll("|", "\\|").replaceAll("_", "\\_").replace(/<(\/|)[a-z]*>/gm, ""))
                                        .setFooter({
                                            text: "Data provided by Argon"
                                        })
                                ], components: [row]
                            })
                        } else {
                            let title;

                            if (meta.songs[id].original) {
                                title = meta.songs[id].original + " - " + meta.songs[id].name;
                            } else {
                                title = meta.songs[id].author + " - " + meta.songs[id].name;
                            }

                            LyricsGrabber.grab(title, "").then((lyrics) => {
                                interaction.editReply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setTitle(":notes: Lyrics")
                                            .setDescription(lyrics)
                                            .setFooter({
                                                text: "Data provided by Genius"
                                            })
                                    ], components: [row]
                                })
                            })
                        }
                    })
                } else {
                    LyricsGrabber.grab(VoiceBase.queue.get(0).title, VoiceBase.queue.get(0).author).then((lyrics) => {
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(":notes: Lyrics")
                                    .setDescription(lyrics)
                                    .setFooter({
                                        text: "Data provided by Genius"
                                    })
                            ], components: [row]
                        })
                    })
                }
            })
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"join","args":{}}')
                                .setLabel('Join')
                                .setStyle('SECONDARY'),
                        )
                ]
            });
        }
    }
}