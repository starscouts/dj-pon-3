import {CommandBase} from "../core/CommandBase";
import {GuildMember, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {entersState, joinVoiceChannel, VoiceConnectionStatus,} from '@discordjs/voice';
import {CommandAction} from "../core/CommandAction";
import {LogManager} from "../core/LogManager";
import {CoolLoader} from "../core/CoolLoader";

export class JoinCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("join")
            .setDescription("Connects the bot to the voice channel you're in")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
            const channel = VoiceBase.voiceChannel = interaction.member.voice.channel;
            VoiceBase.textChannel = interaction.channel;
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(() => {
                const connection = VoiceBase.connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id, // @ts-ignore
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });

                entersState(connection, VoiceConnectionStatus.Ready, 30e3).then(() => {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":white_check_mark: Joined you in <#" + channel.id + ">")
                        ], components: [
                            new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('{"_custom":"addModal"}')
                                        .setLabel('Add')
                                        .setStyle('SUCCESS'),
                                    new MessageButton()
                                        .setCustomId('{"command":"stop","args":{}}')
                                        .setLabel('Stop')
                                        .setStyle('DANGER'),
                                )
                        ]
                    }).then(() => {
                        LogManager.info("/join: joined!");
                    });
                    VoiceBase.connected = true;
                });

                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    LogManager.info("/join: handling disconnection (admin action?)");

                    try {
                        if (VoiceBase.player) VoiceBase.player.stop();
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
                    } catch (e) {
                    }
                })
            });
        } else {
            if (interaction.user.id === "186730180872634368") {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":x: Sorry cutie, you need to be in a voice channel. Love from <@493845599469174794> :heart:")
                    ]
                }).then(() => {
                    LogManager.info("/join: user disconnected (twi)");
                });
            } else if (interaction.user.id === "493845599469174794") {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":x: Please join a voice channel!")
                    ]
                }).then(() => {
                    LogManager.info("/join: user disconnected (scoots)");
                });
            } else {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":x: You fucking idiot! How am I supposed to join a voice channel if you're not in a voice channel?")
                    ]
                }).then(() => {
                    LogManager.info("/join: user disconnected");
                });
            }
        }
    }
}