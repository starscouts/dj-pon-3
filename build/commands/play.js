"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const voice_1 = require("@discordjs/voice");
const YoutubeVideo_1 = require("../core/YoutubeVideo");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = require("fs");
const CommandAction_1 = require("../core/CommandAction");
const CoolLoader_1 = require("../core/CoolLoader");
const Cleanup_1 = require("../core/Cleanup");
const CommandInteractionManager_1 = require("../core/CommandInteractionManager");
class PlayCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("play")
            .setDescription("Starts playing music in the queue");
    }
    static nowPlaying(index) {
        let VoiceBase = global.VoiceBase;
        let row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('{"_custom":"addModal"}')
            .setLabel('Add')
            .setStyle('SUCCESS'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"pause","args":{}}')
            .setLabel('Pause')
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
        let embed = new discord_js_1.MessageEmbed()
            .setDescription(":musical_note: Now playing **[" + VoiceBase.queue.get(index).title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + VoiceBase.queue.get(index).url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ")**")
            .setThumbnail(VoiceBase.queue.get(index).thumbnail);
        if (VoiceBase.queue.list()[index + 1]) {
            let relative;
            let song = VoiceBase.queue.list()[index + 1];
            let playIn;
            if (song.index === 0) {
                playIn = "now";
            }
            else {
                let queueLength = global.VoiceBase.queue.list().filter((e, i) => i < song.index).map(i => {
                    return i.length;
                })[0];
                if (queueLength < 60) {
                    playIn = "in less than a minute";
                }
                else {
                    let queueLengthMin = Math.round(queueLength / 60);
                    if (queueLengthMin === 1) {
                        playIn = "in a minute";
                    }
                    else {
                        playIn = "in " + queueLengthMin + " minutes";
                    }
                }
            }
            relative = ", " + playIn;
            if (VoiceBase.queue.get(index).added_by !== global.client.user.id) {
                embed.addField("Up next", "[" + VoiceBase.queue.get(index + 1).title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + VoiceBase.queue.get(index + 1).url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + ") (`" + new Date(VoiceBase.queue.get(index + 1).length * 1000).toISOString().substring(14, 19) + "`" + relative + ")", true);
            }
        }
        embed.addField("Artist", VoiceBase.queue.get(index).author, true);
        if (VoiceBase.queue.get(index).added_by !== global.client.user.id) {
            embed.addField("Added by", "<@" + VoiceBase.queue.get(index).added_by + "> (<t:" + Math.round(VoiceBase.queue.get(index).added_date.getTime() / 1000) + ":R>)", true);
        }
        else {
            embed.addField("Added by", "Auto DJ", true);
        }
        return {
            embeds: [embed], components: [row]
        };
    }
    async play(interaction, interactive) {
        let VoiceBase = global.VoiceBase;
        Cleanup_1.Cleanup.cleanup();
        if (VoiceBase.autodj) {
            let items = global.playbackHistory.map((i) => {
                return i.url;
            });
            let item = items[Math.floor(Math.random() * items.length)];
            await CommandInteractionManager_1.CommandInteractionManager.commands["add"].handle(new CommandAction_1.CommandAction("add", interaction, { "query": item }), true);
        }
        let row2 = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('{"_custom":"addModal"}')
            .setLabel('Add')
            .setStyle('SUCCESS'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"pause","args":{}}')
            .setLabel('Pause')
            .setStyle('PRIMARY')
            .setDisabled(true), new discord_js_1.MessageButton()
            .setCustomId('{"command":"skip","args":{}}')
            .setLabel('Skip')
            .setStyle('PRIMARY')
            .setDisabled(true), new discord_js_1.MessageButton()
            .setCustomId('{"command":"stop","args":{}}')
            .setLabel('Stop')
            .setStyle('DANGER'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"queue","args":{}}')
            .setLabel('View Queue')
            .setStyle('SECONDARY'));
        if (!VoiceBase.connected)
            return;
        if (VoiceBase.queue.list().length === 0) {
            if (VoiceBase.player)
                VoiceBase.player.stop();
            VoiceBase.playing = false;
            VoiceBase.paused = false;
            VoiceBase.queue.flush();
            VoiceBase.textChannel.send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":white_check_mark: Reached end of the queue!")
                ], components: [row2]
            });
            return;
        }
        YoutubeVideo_1.YoutubeVideo.get(VoiceBase.queue.get(0).url.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\["), VoiceBase.queue.get(0).source).then(output => {
            let ffmpegCmd = (0, fluent_ffmpeg_1.default)(output)
                .noVideo()
                .audioCodec("libopus")
                .audioFilters(["loudnorm=I=-16:LRA=11:TP=-1.5"])
                .save("/tmp/stream.ogg")
                .once("end", () => {
                const player = VoiceBase.player = (0, voice_1.createAudioPlayer)();
                const resource = (0, voice_1.createAudioResource)((0, fs_1.createReadStream)("/tmp/stream.ogg"));
                player.play(resource);
                (0, voice_1.entersState)(player, voice_1.AudioPlayerStatus.Playing, 5e3).then(() => {
                    VoiceBase.playStartDate = new Date();
                    VoiceBase.connection.subscribe(player);
                    VoiceBase.currentSong = VoiceBase.queue.get(0);
                    if (interactive) {
                        interaction.editReply(PlayCommand.nowPlaying(0));
                    }
                    else {
                        VoiceBase.textChannel.send(PlayCommand.nowPlaying(0));
                    }
                    VoiceBase.playing = true;
                    VoiceBase.paused = false;
                    global.waitUntilDoneInterval = setInterval(() => {
                        if (resource.ended) {
                            try {
                                clearInterval(global.waitUntilDoneInterval);
                            }
                            catch (e) {
                            }
                            VoiceBase.playing = false;
                            if (VoiceBase.repeatOnce) {
                                let cmd = new PlayCommand();
                                cmd.play(interaction, false);
                            }
                            else if (VoiceBase.repeat) {
                                let item = VoiceBase.queue.get(0);
                                VoiceBase.queue.add(item.url).then(() => {
                                    VoiceBase.queue.remove(0);
                                    let cmd = new PlayCommand();
                                    cmd.play(interaction, false);
                                });
                            }
                            else {
                                VoiceBase.queue.remove(0);
                                let cmd = new PlayCommand();
                                cmd.play(interaction, false);
                            }
                        }
                    }, 100);
                });
            });
        });
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        let row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('{"_custom":"addModal"}')
            .setLabel('Add')
            .setStyle('SUCCESS'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"pause","args":{}}')
            .setLabel('Pause')
            .setStyle('PRIMARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"skip","args":{}}')
            .setLabel('Skip')
            .setStyle('PRIMARY'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"stop","args":{}}')
            .setLabel('Stop')
            .setStyle('DANGER'), new discord_js_1.MessageButton()
            .setCustomId('{"command":"queue","args":{}}')
            .setLabel('View Queue')
            .setStyle('SECONDARY'));
        if (VoiceBase.connected) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(() => {
                if (!VoiceBase.playing) {
                    this.play(interaction, true);
                }
                else {
                    if (!VoiceBase.paused) {
                        interaction.editReply(PlayCommand.nowPlaying(0));
                    }
                    else {
                        if (VoiceBase.player.unpause()) {
                            VoiceBase.playStartDate = new Date(VoiceBase.playStartDate.getTime() - (VoiceBase.pauseStartDate.getTime() - new Date().getTime()));
                            VoiceBase.pauseStartDate = null;
                            interaction.editReply({
                                embeds: [
                                    new discord_js_1.MessageEmbed()
                                        .setDescription(":arrow_forward: Resumed.")
                                ], components: [row]
                            });
                        }
                        else {
                            interaction.editReply(":x: Failed to resume, this is most likely a bug.");
                        }
                    }
                }
            });
        }
        else {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: The bot is disconnected.")
                ],
                components: [
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
exports.PlayCommand = PlayCommand;
//# sourceMappingURL=play.js.map