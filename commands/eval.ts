import {CommandBase} from "../core/CommandBase";
import {MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {LogManager} from "../core/LogManager";

export class EvalCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("eval")
            .setDescription("Runs code on the bot's server")
            .addStringOption(option =>
                option.setName('code')
                    .setDescription("JavaScript source code to run")
                    .setRequired(true)
            )
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        let code = action.getArgument('code').trim();

        LogManager.info("/eval: >" + code);

        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":x: You need to be an alicorn.")
                ]
            }).then(() => {
                LogManager.info("/eval: permission denied");
            });
            return;
        }

        let out = "(nothing)";
        try {
            let run = eval(code);
            try {
                out = JSON.stringify(run);
            } catch (e) {
                out = run;
            }
        } catch (e) {
            console.error(e.stack);
            out = e.stack;
        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .addField("Input:", "```" + code + "```")
                    .addField("Output:", "```" + out + "```")
            ]
        }).then(() => {
            LogManager.info("/eval: executed");
        });
    }
}