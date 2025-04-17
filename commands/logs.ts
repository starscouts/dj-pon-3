import {CommandBase} from "../core/CommandBase";
import {MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {LogManager} from "../core/LogManager";
import * as fs from "fs";
import {CommandAction} from "../core/CommandAction";

export class LogsCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("logs")
            .setDescription("Gives you the bot's log files")
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
            }).then(() => {
                LogManager.info("/logs: permission denied");
            });
            return;
        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(":newspaper: Bot Logs")
                    .setDescription("```plaintext\n" + fs.readFileSync("logs/" + LogManager.logID + ".txt").toString().trim().split("\n").reverse().filter((e, i) => i < 5).join("\n") + "\n```")
            ],
            files: [
                "./logs/" + LogManager.logID + ".txt"
            ]
        }).then(() => {
            LogManager.info("/join: sent logs");
        });
    }
}