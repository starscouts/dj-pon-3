"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const builders_1 = require("@discordjs/builders");
const fs = __importStar(require("fs"));
const discord_js_1 = require("discord.js");
class RestartCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("restart")
            .setDescription("Restarts the bot");
    }
    handle(action) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":x: You need to be an alicorn.")
                ]
            });
            return;
        }
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
        interaction.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setDescription(":white_check_mark: The bot is now restarting")
            ]
        }).then(() => {
            fs.writeFileSync("./RESTART-FORCE", "");
        });
    }
}
exports.RestartCommand = RestartCommand;
//# sourceMappingURL=restart.js.map