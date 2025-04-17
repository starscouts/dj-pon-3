import {Client, MessageEmbed} from 'discord.js';
import * as fs from 'fs';
import * as crypto from 'crypto';
import {LogManager} from "./LogManager";
import {CommandInteractionManager} from "./CommandInteractionManager";
import {ButtonInteractionManager} from "./ButtonInteractionManager";
import {VoiceBase} from "./VoiceBase";
import {PresenceManager} from "./PresenceManager";
import {ModalInteractionManager} from "./ModalInteractionManager";
import {SlashCommandsRefresher} from "./SlashCommandsRefresher";
import {InactivityTimer} from "./InactivityTimer";
import {AutocompleteInteractionManager} from "./AutocompleteInteractionManager";
import {ErrorParser} from "./ErrorParser";

global.VoiceBase = new VoiceBase();

process.on('uncaughtException', (error) => {
    if (error.message === "WebSocket was closed before the connection was established") {
        LogManager.error("Bot has encountered a connection error, restarting.");
        fs.writeFileSync("./RESTART-FORCE", "");
        return;
    }
    LogManager.error(error.stack);

    let message = {
        embeds: [
            new MessageEmbed()
                .setTitle(":no_entry: An internal error occurred with the bot")
                .setDescription("We are sorry, but an error has occurred and the bot cannot process your request for now. This is most likely a problem on our side, please try again later.\n\n> " + ErrorParser.parse(error.name, error.message) + "\n\n\\*\\*\\*\\* BugCheck 0x" + crypto.createHash('md5').update(error.name + error.message).digest('hex').substring(0, 8).toUpperCase())
                .addField("Are you a developer?", "Check the bot logs (e.g. with `/logs`) for additional details and a stack trace.")
                .addField("Version information", "version " + (fs.existsSync("./.git/refs/heads/mane") ? fs.readFileSync("./.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("../.git/refs/heads/mane") ? fs.readFileSync("../.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("./version.txt") ? fs.readFileSync("./version.txt").toString().trim() : (fs.existsSync("../version.txt") ? fs.readFileSync("../version.txt").toString().trim() : "live")))) + ", build " + (fs.existsSync("./build.txt") ? fs.readFileSync("./build.txt").toString().trim() : (fs.existsSync("../build.txt") ? fs.readFileSync("../build.txt").toString().trim() : "dev")) + " (use `/about` for more details)")
        ]
    }

    if (global.VoiceBase.textChannel) {
        global.VoiceBase.textChannel.send(message)
    } else if (global.lastKnownInteraction) {
        global.lastKnownInteraction.channel.send(message);
    }
})

export class DJPon3 {
    constructor(token: string) {
        const client = global.client = new Client({intents: ['GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILDS']});

        client.on('ready', () => {
            LogManager.info(`Logged in as ${client.user.tag}!`);
            PresenceManager.start(client);
            SlashCommandsRefresher.refresh(client.user.id, token);

            setInterval(() => {
                InactivityTimer.trigger();

                if (global.VoiceBase.connected && !global.VoiceBase.playing && !InactivityTimer.running()) {
                    InactivityTimer.start();
                } else {
                    if (InactivityTimer.running() && global.VoiceBase.connected && global.VoiceBase.playing) InactivityTimer.stop();
                }
            }, 1000);
        });

        client.on('interactionCreate', async interaction => {
            global.lastKnownInteraction = interaction;
            if (!interaction.guild) {
                // @ts-ignore
                if (interaction.channel) { // @ts-ignore
                    interaction.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(":x: The bot can not be used in direct messages.")
                        ]
                    });
                }
                return;
            }

            global.processingStart = new Date();
            if (interaction.isCommand()) {
                new CommandInteractionManager(interaction);
            } else if (interaction.isButton()) {
                new ButtonInteractionManager(interaction);
            } else if (interaction.isModalSubmit()) {
                new ModalInteractionManager(interaction);
            } else if (interaction.isAutocomplete()) {
                new AutocompleteInteractionManager(interaction);
            }
        });

        client.login(token);
    }
}