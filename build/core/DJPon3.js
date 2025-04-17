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
exports.DJPon3 = void 0;
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const LogManager_1 = require("./LogManager");
const CommandInteractionManager_1 = require("./CommandInteractionManager");
const ButtonInteractionManager_1 = require("./ButtonInteractionManager");
const VoiceBase_1 = require("./VoiceBase");
const PresenceManager_1 = require("./PresenceManager");
const ModalInteractionManager_1 = require("./ModalInteractionManager");
const SlashCommandsRefresher_1 = require("./SlashCommandsRefresher");
const InactivityTimer_1 = require("./InactivityTimer");
const AutocompleteInteractionManager_1 = require("./AutocompleteInteractionManager");
const ErrorParser_1 = require("./ErrorParser");
global.VoiceBase = new VoiceBase_1.VoiceBase();
process.on('uncaughtException', (error) => {
    if (error.message === "WebSocket was closed before the connection was established") {
        LogManager_1.LogManager.error("Bot has encountered a connection error, restarting.");
        fs.writeFileSync("./RESTART-FORCE", "");
        return;
    }
    LogManager_1.LogManager.error(error.stack);
    let message = {
        embeds: [
            new discord_js_1.MessageEmbed()
                .setTitle(":no_entry: An internal error occurred with the bot")
                .setDescription("We are sorry, but an error has occurred and the bot cannot process your request for now. This is most likely a problem on our side, please try again later.\n\n> " + ErrorParser_1.ErrorParser.parse(error.name, error.message) + "\n\n\\*\\*\\*\\* BugCheck 0x" + crypto.createHash('md5').update(error.name + error.message).digest('hex').substring(0, 8).toUpperCase())
                .addField("Are you a developer?", "Check the bot logs (e.g. with `/logs`) for additional details and a stack trace.")
                .addField("Version information", "version " + (fs.existsSync("./.git/refs/heads/mane") ? fs.readFileSync("./.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("../.git/refs/heads/mane") ? fs.readFileSync("../.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("./version.txt") ? fs.readFileSync("./version.txt").toString().trim() : (fs.existsSync("../version.txt") ? fs.readFileSync("../version.txt").toString().trim() : "live")))) + ", build " + (fs.existsSync("./build.txt") ? fs.readFileSync("./build.txt").toString().trim() : (fs.existsSync("../build.txt") ? fs.readFileSync("../build.txt").toString().trim() : "dev")) + " (use `/about` for more details)")
        ]
    };
    if (global.VoiceBase.textChannel) {
        global.VoiceBase.textChannel.send(message);
    }
    else if (global.lastKnownInteraction) {
        global.lastKnownInteraction.channel.send(message);
    }
});
class DJPon3 {
    constructor(token) {
        const client = global.client = new discord_js_1.Client({ intents: ['GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILDS'] });
        client.on('ready', () => {
            LogManager_1.LogManager.info(`Logged in as ${client.user.tag}!`);
            PresenceManager_1.PresenceManager.start(client);
            SlashCommandsRefresher_1.SlashCommandsRefresher.refresh(client.user.id, token);
            setInterval(() => {
                InactivityTimer_1.InactivityTimer.trigger();
                if (global.VoiceBase.connected && !global.VoiceBase.playing && !InactivityTimer_1.InactivityTimer.running()) {
                    InactivityTimer_1.InactivityTimer.start();
                }
                else {
                    if (InactivityTimer_1.InactivityTimer.running() && global.VoiceBase.connected && global.VoiceBase.playing)
                        InactivityTimer_1.InactivityTimer.stop();
                }
            }, 1000);
        });
        client.on('interactionCreate', async (interaction) => {
            global.lastKnownInteraction = interaction;
            if (!interaction.guild) {
                // @ts-ignore
                if (interaction.channel) { // @ts-ignore
                    interaction.channel.send({
                        embeds: [
                            new discord_js_1.MessageEmbed()
                                .setDescription(":x: The bot can not be used in direct messages.")
                        ]
                    });
                }
                return;
            }
            global.processingStart = new Date();
            if (interaction.isCommand()) {
                new CommandInteractionManager_1.CommandInteractionManager(interaction);
            }
            else if (interaction.isButton()) {
                new ButtonInteractionManager_1.ButtonInteractionManager(interaction);
            }
            else if (interaction.isModalSubmit()) {
                new ModalInteractionManager_1.ModalInteractionManager(interaction);
            }
            else if (interaction.isAutocomplete()) {
                new AutocompleteInteractionManager_1.AutocompleteInteractionManager(interaction);
            }
        });
        client.login(token);
    }
}
exports.DJPon3 = DJPon3;
//# sourceMappingURL=DJPon3.js.map