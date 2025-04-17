"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const voice_1 = require("@discordjs/voice");
const LogManager_1 = require("../core/LogManager");
const CoolLoader_1 = require("../core/CoolLoader");
class JoinCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("join")
            .setDescription("Connects the bot to the voice channel you're in");
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel) {
            const channel = VoiceBase.voiceChannel = interaction.member.voice.channel;
            VoiceBase.textChannel = interaction.channel;
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader_1.CoolLoader.message())
                ]
            }).then(() => {
                const connection = VoiceBase.connection = (0, voice_1.joinVoiceChannel)({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Ready, 30e3).then(() => {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":white_check_mark: Joined you in <#" + channel.id + ">")
                        ], components: [
                            new discord_js_1.MessageActionRow()
                                .addComponents(new discord_js_1.MessageButton()
                                .setCustomId('{"_custom":"addModal"}')
                                .setLabel('Add')
                                .setStyle('SUCCESS'), new discord_js_1.MessageButton()
                                .setCustomId('{"command":"stop","args":{}}')
                                .setLabel('Stop')
                                .setStyle('DANGER'))
                        ]
                    }).then(() => {
                        LogManager_1.LogManager.info("/join: joined!");
                    });
                    VoiceBase.connected = true;
                });
                connection.on(voice_1.VoiceConnectionStatus.Disconnected, () => {
                    LogManager_1.LogManager.info("/join: handling disconnection (admin action?)");
                    try {
                        if (VoiceBase.player)
                            VoiceBase.player.stop();
                        VoiceBase.connection.disconnect();
                        VoiceBase.connected = false;
                        VoiceBase.playing = false;
                        VoiceBase.paused = false;
                        VoiceBase.repeat = false;
VoiceBase.repeatOnce = false;
                        VoiceBase.autodj = false;
                        VoiceBase.connection = null;
                        VoiceBase.textChannel = null;
                        VoiceBase.voiceChannel = null;
                        VoiceBase.queue.flush();
                    }
                    catch (e) { }
                });
            });
        }
        else {
            if (interaction.user.id === "186730180872634368") {
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":x: Sorry cutie, you need to be in a voice channel. Love from <@493845599469174794> :heart:")
                    ]
                }).then(() => {
                    LogManager_1.LogManager.info("/join: user disconnected (twi)");
                });
            }
            else if (interaction.user.id === "493845599469174794") {
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":x: Please join a voice channel!")
                    ]
                }).then(() => {
                    LogManager_1.LogManager.info("/join: user disconnected (scoots)");
                });
            }
            else {
                interaction.reply({
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setDescription(":x: You fucking idiot! How am I supposed to join a voice channel if you're not in a voice channel?")
                    ]
                }).then(() => {
                    LogManager_1.LogManager.info("/join: user disconnected");
                });
            }
        }
    }
}
exports.JoinCommand = JoinCommand;
//# sourceMappingURL=join.js.map