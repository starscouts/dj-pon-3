import {CommandBase} from "../core/CommandBase";
import {SlashCommandBuilder} from "@discordjs/builders";
import * as fs from 'fs';
import {CommandAction} from "../core/CommandAction";
import {MessageEmbed} from "discord.js";

export class RestartCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("restart")
            .setDescription("Restarts the bot")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: You need to be an alicorn.")
                ]
            });
            return;
        }

        try {
            if (VoiceBase.player) VoiceBase.player.stop();
            VoiceBase.connection.disconnect();
            VoiceBase.connected = false;
            VoiceBase.playing = false;
            VoiceBase.paused = false;
            VoiceBase.repeat = false;
            VoiceBase.autodj = false;
            VoiceBase.connection = null;
            VoiceBase.textChannel = null;
            VoiceBase.voiceChannel = null;
            VoiceBase.queue.flush();
        } catch (e) {
        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(":white_check_mark: The bot is now restarting")
            ]
        }).then(() => {
            fs.writeFileSync("./RESTART-FORCE", "");
        });
    }
}
