"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const LogManager_1 = require("../core/LogManager");
class EvalCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("eval")
            .setDescription("Runs code on the bot's server")
            .addStringOption(option => option.setName('code')
            .setDescription("JavaScript source code to run")
            .setRequired(true));
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        let code = action.getArgument('code').trim();
        LogManager_1.LogManager.info("/eval: >" + code);
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: You need to be an alicorn.")
                ]
            }).then(() => {
                LogManager_1.LogManager.info("/eval: permission denied");
            });
            return;
        }
        let out = "(nothing)";
        try {
            let run = eval(code);
            try {
                out = JSON.stringify(run);
            }
            catch (e) {
                out = run;
            }
        }
        catch (e) {
            console.error(e.stack);
            out = e.stack;
        }
        interaction.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .addField("Input:", "```" + code + "```")
                    .addField("Output:", "```" + out + "```")
            ]
        }).then(() => {
            LogManager_1.LogManager.info("/eval: executed");
        });
    }
}
exports.EvalCommand = EvalCommand;
//# sourceMappingURL=eval.js.map