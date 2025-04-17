import {CommandBase} from "../core/CommandBase";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {CoolLoader} from "../core/CoolLoader";

export class StopCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("stop")
            .setDescription("Stops the bot from playing")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (VoiceBase.connected) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<a:loader:987706687022579762> Just a moment...")
                        .setDescription(CoolLoader.message())
                ]
            }).then(() => {
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
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(":white_check_mark: Stopped the bot.")
                    ]
                });
            });
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