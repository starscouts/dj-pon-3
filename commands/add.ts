import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {YoutubeVideo} from "../core/YoutubeVideo";
import {CommandAction} from "../core/CommandAction";
import {PlatformDetector} from "../core/PlatformDetector";
import {execFile as execFile_cb} from 'child_process';
import {promisify} from 'util';
import axios from 'axios';
import * as fs from "fs";
import {LogManager} from "../core/LogManager";
import {CoolLoader} from "../core/CoolLoader";

const execFile = promisify(execFile_cb);

async function handleAdd(action, VoiceBase, interaction, author, autoDjMode) {
    if (autoDjMode) author = global.client.user.id;

    try {
        let query = action.getArgument('query').trim();
        let url = query;

        if (await PlatformDetector.isYoutube(query)) {
            if (query.includes("dQw4w9WgXcQ")) {
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":x: Sorry, I can't let you do a Rick roll.")
                    ]
                }).then(() => {
                    LogManager.info("/add: preventing Rick roll");
                });
                return;
            }
            VoiceBase.queue.add(url, author).then((song) => {
                if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                    LogManager.info("/add: added");
                });
            }).catch((e) => {
                if (e.message === "Song too long") {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                        ]
                    }).then(() => {
                        LogManager.info("/add: preventing >10 minutes");
                    });
                    return;
                } else {
                    throw e;
                }
            });
        } else if (await PlatformDetector.isYoutubePlaylist(query)) {
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription("Processing playlist... (this may take a while)")
                ]
            }).then(() => {
                LogManager.info("/add: processing playlist (youtube)");
            })
            let file = '/tmp/playlistDL-' + Math.random() + '.json';
            fs.createWriteStream(file);
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-single-json", "--", query], {maxBuffer: 10 * 1024 * 1024})).stdout.toString().trim());
            let list = data.entries;
            let index = 1;
            for (let item of list) {
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<a:loader:987706687022579762> Just a moment...")
                            .setDescription("Adding song " + index + " of " + list.length + "...")
                    ]
                })
                await VoiceBase.queue.add(item.original_url, author);
                index++;
            }
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":white_check_mark: Added " + list.length + " songs from <:1742216f9376dbbe9d55e43f3ac9f49f:977521939709034506> **[" + data.title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + data.original_url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")** to the queue")
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"play","args":{}}')
                                .setLabel('Play')
                                .setStyle('PRIMARY')
                                .setDisabled(global.VoiceBase.playing),
                            new MessageButton()
                                .setCustomId('{"_custom":"addModal"}')
                                .setLabel('Add')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('{"command":"queue","args":{}}')
                                .setLabel('View Queue')
                                .setStyle('SECONDARY'),
                        )
                ]
            }).then(() => {
                LogManager.info("/add: done processing playlist");
            });
            return;
        } else if (await PlatformDetector.isBandcamp(query)) {
            VoiceBase.queue.add_bandcamp(url, author).then((song) => {
                if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                    LogManager.info("/add: added");
                });
            }).catch((e) => {
                if (e.message === "Song too long") {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                        ]
                    }).then(() => {
                        LogManager.info("/add: preventing >10 minutes");
                    });
                    return;
                } else {
                    throw e;
                }
            });
            return;
        } else if (await PlatformDetector.isBandcampAlbum(query)) {
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription("Processing album... (this may take a while)")
                ]
            }).then(() => {
                LogManager.info("/add: processing playlist (bandcamp)");
            })
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-single-json", "--", query], {maxBuffer: 10 * 1024 * 1024})).stdout.toString().trim());
            let list = data.entries;
            let index = 1;
            for (let item of list) {
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<a:loader:987706687022579762> Just a moment...")
                            .setDescription("Adding song " + index + " of " + list.length + "...")
                    ]
                })
                await VoiceBase.queue.add_bandcamp(item.original_url, author);
                index++;
            }
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":white_check_mark: Added " + list.length + " songs from <:f6e647ff9fe9cb215cd70bb027de05a3:977521601828499576> **[" + data.title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + data.original_url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")** to the queue")
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"play","args":{}}')
                                .setLabel('Play')
                                .setStyle('PRIMARY')
                                .setDisabled(global.VoiceBase.playing),
                            new MessageButton()
                                .setCustomId('{"_custom":"addModal"}')
                                .setLabel('Add')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('{"command":"queue","args":{}}')
                                .setLabel('View Queue')
                                .setStyle('SECONDARY'),
                        )
                ]
            }).then(() => {
                LogManager.info("/add: done processing playlist");
            });
            return;
        } else if (await PlatformDetector.isSoundcloud(query)) {
            VoiceBase.queue.add_soundcloud(url, author).then((song) => {
                if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                    LogManager.info("/add: added");
                });
            }).catch((e) => {
                if (e.message === "Song too long") {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                        ]
                    }).then(() => {
                        LogManager.info("/add: preventing >10 minutes");
                    });
                    return;
                } else {
                    throw e;
                }
            });
            return;
        } else if (await PlatformDetector.isSoundcloudSet(query)) {
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription("Processing set... (this may take a while)")
                ]
            }).then(() => {
                LogManager.info("/add: processing playlist (soundcloud)");
            })
            let data = JSON.parse((await execFile("yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-single-json", "--", query], {maxBuffer: 10 * 1024 * 1024})).stdout.toString().trim());
            let list = data.entries;
            let index = 1;
            for (let item of list) {
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<a:loader:987706687022579762> Just a moment...")
                            .setDescription("Adding song " + index + " of " + list.length + "...")
                    ]
                })
                await VoiceBase.queue.add_soundcloud(item.original_url, author);
                index++;
            }
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":white_check_mark: Added " + list.length + " songs from <:21800e074a5ce9e474755d8e161f5598:977521763850260530> **[" + data.title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + data.original_url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")** to the queue")
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"play","args":{}}')
                                .setLabel('Play')
                                .setStyle('PRIMARY')
                                .setDisabled(global.VoiceBase.playing),
                            new MessageButton()
                                .setCustomId('{"_custom":"addModal"}')
                                .setLabel('Add')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('{"command":"queue","args":{}}')
                                .setLabel('View Queue')
                                .setStyle('SECONDARY'),
                        )
                ]
            }).then(() => {
                LogManager.info("/add: done processing playlist");
            });
            return;
        } else if (await PlatformDetector.isArgon(query)) {
            VoiceBase.queue.add_argon(url, author).then((song) => {
                if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                    LogManager.info("/add: added");
                });
            }).catch((e) => {
                if (e.message === "Song too long") {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                        ]
                    }).then(() => {
                        LogManager.info("/add: preventing >10 minutes");
                    });
                    return;
                } else {
                    throw e;
                }
            });
            return;
        } else if (await PlatformDetector.isArgonAlbum(query)) {
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription("Processing album... (this may take a while)")
                ]
            }).then(() => {
                LogManager.info("/add: processing playlist (argon)");
            })
            let data = (await axios.get("https://forced.argon.minteck.org/api/get_list.php")).data.sets;
            let sel = url.replace(/^(http(s|):\/\/)argon\.minteck\.org\/#\/library\/([a-z\d\-_.]*)$/gm, "$3");
            if (!Object.keys(data).includes(sel)) throw new Error("Invalid album ID");
            let list = data[sel].songs.filter(i => !i.startsWith(":"));
            let index = 1;
            for (let item of list) {
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<a:loader:987706687022579762> Just a moment...")
                            .setDescription("Adding song " + index + " of " + list.length + "...")
                    ]
                })
                await VoiceBase.queue.add_argon("https://argon.minteck.org/#/library/" + item, author);
                index++;
            }
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":white_check_mark: Added " + list.length + " songs from <:da3e42286193e2a77318372bdbe9532e:977522075294122025> **[" + data[sel].name.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](https://argon.minteck.org/#/library/" + sel.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")** to the queue")
                ], components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"play","args":{}}')
                                .setLabel('Play')
                                .setStyle('PRIMARY')
                                .setDisabled(global.VoiceBase.playing),
                            new MessageButton()
                                .setCustomId('{"_custom":"addModal"}')
                                .setLabel('Add')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('{"command":"queue","args":{}}')
                                .setLabel('View Queue')
                                .setStyle('SECONDARY'),
                        )
                ]
            }).then(() => {
                LogManager.info("/add: done processing playlist");
            });
            return;
        } else if (await PlatformDetector.isHTTP(query)) {
            VoiceBase.queue.add_http(url, author).then((song) => {
                if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                    LogManager.info("/add: added");
                });
            }).catch((e) => {
                if (e.message === "Song too long") {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                        ]
                    }).then(() => {
                        LogManager.info("/add: preventing >10 minutes");
                    });
                    return;
                } else {
                    throw e;
                }
            });
            return;
        } else {
            YoutubeVideo.search(action.getArgument('query').trim()).then(async (result) => {
                if (result === null) {
                    YoutubeVideo.search_soundcloud(action.getArgument('query').trim()).then((result) => {
                        if (result === null) {
                            interaction.editReply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription(":x: No search result or URL corresponding to your query was found.")
                                ]
                            }).then(() => {
                                LogManager.info("/add: no result");
                            });
                            return;
                        }

                        url = result;
                        if (!PlatformDetector.isSoundcloud(url)) {
                            interaction.editReply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription(":x: This is not a valid SoundCloud song URL.")
                                ]
                            }).then(() => {
                                LogManager.info("/add: result is not valid SoundCloud song");
                            });
                            return;
                        }

                        VoiceBase.queue.add_soundcloud(url, author).then((song) => {
                            if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                                LogManager.info("/add: added");
                            });
                        }).catch((e) => {
                            if (e.message === "Song too long") {
                                interaction.editReply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                                    ]
                                }).then(() => {
                                    LogManager.info("/add: preventing >10 minutes");
                                });
                                return;
                            } else {
                                throw e;
                            }
                        });
                    });
                    return;
                }

                url = result;

                if (query.includes("dQw4w9WgXcQ") || url.includes("dQw4w9WgXcQ")) {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: Sorry, I can't let you do a Rick roll.")
                        ]
                    }).then(() => {
                        LogManager.info("/add: preventing Rick roll");
                    });
                    return;
                }
                VoiceBase.queue.add(url, author).then((song) => {
                    if (!autoDjMode) interaction.editReply(AddCommand.addedReply(song.index)).then(() => {
                        LogManager.info("/add: added");
                    });
                }).catch((e) => {
                    if (e.message === "Song too long") {
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                            ]
                        }).then(() => {
                            LogManager.info("/add: preventing >10 minutes");
                        });
                        return;
                    } else {
                        throw e;
                    }
                });
            });
            return;
        }
    } catch (e) {
        if (e.message === "Song too long") {
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: One or more requested songs is too long (" + new Date(e.duration * 1000).toISOString().substring(14, 19) + ", where the maximum allowed length is 10:00)")
                ]
            }).then(() => {
                LogManager.info("/add: preventing >10 minutes");
            });
            return;
        } else {
            throw e;
        }
    }
}

export class AddCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("add")
            .setDescription("Adds music to the queue")
            .addStringOption(option =>
                option.setName('query')
                    .setDescription("The URL or search query of the song to add")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
    }

    public static addedReply(index: number, alreadyAdded?: boolean): object {
        let song = global.VoiceBase.queue.get(index);

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('{"command":"play","args":{}}')
                    .setLabel('Play')
                    .setStyle('PRIMARY')
                    .setDisabled(global.VoiceBase.playing),
                new MessageButton()
                    .setCustomId('{"_custom":"addModal"}')
                    .setLabel('Add')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('{"command":"queue","args":{}}')
                    .setLabel('View Queue')
                    .setStyle('SECONDARY'),
            );

        let source = "";
        if (song.source === "youtube") {
            source = "<:1742216f9376dbbe9d55e43f3ac9f49f:977521939709034506>";
        } else if (song.source === "argon") {
            source = "<:da3e42286193e2a77318372bdbe9532e:977522075294122025>";
        } else if (song.source === "bandcamp") {
            source = "<:f6e647ff9fe9cb215cd70bb027de05a3:977521601828499576>";
        } else if (song.source === "soundcloud") {
            source = "<:21800e074a5ce9e474755d8e161f5598:977521763850260530>";
        } else if (song.source === "http") {
            source = "([s](http://" + song.author + "))";
        }

        let playIn;
        if (song.index === 0) {
            playIn = "now";
        } else {
            let queueLength = global.VoiceBase.queue.list().filter((e, i) => i < song.index).map(i => {
                return i.length;
            })[0];

            if (queueLength < 60) {
                playIn = "in less than a minute";
            } else {
                let queueLengthMin = Math.round(queueLength / 60);
                if (queueLengthMin === 1) {
                    playIn = "in a minute";
                } else {
                    playIn = "in " + queueLengthMin + " minutes";
                }
            }
        }

        return {
            embeds: [
                new MessageEmbed()
                    .setDescription(alreadyAdded ? ":information_source: Information about " + source + " **[" + song.title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + song.url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")**" : ":white_check_mark: Added " + source + " **[" + song.title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + song.url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")** to queue.")
                    .addField("Artist", song.author ?? "<Unknown>", true)
                    .addField("Position", AddCommand.ordinate(song.index), true)
                    .addField("Playing", playIn, true)
                    .addField("Added by", "<@" + song.added_by + "> (<t:" + Math.round(song.added_date.getTime() / 1000) + ":R>)", true)
                    .setThumbnail(song.thumbnail)
            ], components: [row]
        }
    }

    private static ordinate(number: number) {
        let num = number + 1,
            last = num.toString().slice(-1),
            ord = '';
        switch (last) {
            case '1':
                if (num.toString().slice(-2) !== "11") {
                    ord = 'st';
                } else {
                    ord = 'th';
                }
                break;
            case '2':
                if (num.toString().slice(-2) !== "12") {
                    ord = 'nd';
                } else {
                    ord = 'th';
                }
                break;
            case '3':
                if (num.toString().slice(-2) !== "13") {
                    ord = 'rd';
                } else {
                    ord = 'th';
                }
                break;
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                ord = 'th';
                break;
        }
        return num.toString() + ord;
    }

    public async handle(action: CommandAction, autoDjMode: boolean) {
        let interaction = action.getInteraction();
        let author = interaction.user.id;
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.autodj && !autoDjMode) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            })
            return;
        }

        if (VoiceBase.connected) {
            VoiceBase.textChannel = interaction.channel;
            if (!autoDjMode) await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            });
            await handleAdd(action, VoiceBase, interaction, author, autoDjMode);
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('{"command":"join","args":{}}')
                                .setLabel('Join')
                                .setStyle('SECONDARY'),
                        )
                ]
            }).then(() => {
                LogManager.info("/add: disconnected");
            });
        }
    }
}
