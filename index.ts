import * as fs from 'fs';
import {LogManager} from "./core/LogManager";
import {DJPon3} from "./core/DJPon3";
import {MessageEmbed} from "discord.js";

global.version = (fs.existsSync("./.git/refs/heads/mane") ? fs.readFileSync("./.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("../.git/refs/heads/mane") ? fs.readFileSync("../.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("./version.txt") ? fs.readFileSync("./version.txt").toString().trim() : (fs.existsSync("../version.txt") ? fs.readFileSync("../version.txt").toString().trim() : "live"))));
global.build = (fs.existsSync("./build.txt") ? fs.readFileSync("./build.txt").toString().trim() : (fs.existsSync("../build.txt") ? fs.readFileSync("../build.txt").toString().trim() : "dev"));

let restartWarningNotified = false;

function restart() {
    if (fs.existsSync("./data/lastRestart") && new Date().getTime() - new Date(fs.readFileSync("./data/lastRestart").toString()).getTime() < 60000) {
        LogManager.error("Restart cancelled: too close to another restart, try again in a few seconds.");
        fs.rmSync("./RESTART", {recursive: true});
    } else {
        fs.rmSync("./RESTART", {recursive: true});
        fs.writeFileSync("./data/lastRestart", new Date().toISOString());
        LogManager.warn("Restart requested.");
        process.exit(14);
    }
}

async function restartManager() {
    let VoiceBase = global.VoiceBase;

    if (fs.existsSync("./RESTART")) {
        try {
            if (VoiceBase.playing && VoiceBase.queue.list().length !== 0 && !restartWarningNotified) {
                LogManager.info("Scheduled restart.")
                VoiceBase.textChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(":warning: The bot needs to restart to apply an update")
                            .setDescription("An update has been installed and the bot needs to restart to apply it. It will restart once the playback is stopped. To restart the bot now, use `/stop`.")
                            .addField("What is this update?", "From:\n    version " + global.version + ", build " + global.build + "\nTo:\n    version " + (fs.existsSync("./.git/refs/heads/mane") ? fs.readFileSync("./.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("../.git/refs/heads/mane") ? fs.readFileSync("../.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("./version.txt") ? fs.readFileSync("./version.txt").toString().trim() : (fs.existsSync("../version.txt") ? fs.readFileSync("../version.txt").toString().trim() : "live")))) + ", build " + (fs.existsSync("./build.txt") ? fs.readFileSync("./build.txt").toString().trim() : (fs.existsSync("../build.txt") ? fs.readFileSync("../build.txt").toString().trim() : "dev")))
                    ]
                })

                restartWarningNotified = true;
            } else if (!VoiceBase.playing && VoiceBase.queue.list().length === 0) {
                if (restartWarningNotified) {
                    VoiceBase.textChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(":warning: The bot needs to restart to apply an update")
                                .setDescription("The bot is now restarting to install version " + (fs.existsSync("./.git/refs/heads/mane") ? fs.readFileSync("./.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("../.git/refs/heads/mane") ? fs.readFileSync("../.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("./version.txt") ? fs.readFileSync("./version.txt").toString().trim() : (fs.existsSync("../version.txt") ? fs.readFileSync("../version.txt").toString().trim() : "live")))) + ", build " + (fs.existsSync("./build.txt") ? fs.readFileSync("./build.txt").toString().trim() : (fs.existsSync("../build.txt") ? fs.readFileSync("../build.txt").toString().trim() : "dev")) + "; this may take a while.")
                        ]
                    }).then(() => {
                        restart();
                    })

                    try {
                        if (VoiceBase.player) VoiceBase.player.stop();
                        VoiceBase.connection.disconnect();
                        VoiceBase.connected = false;
                        VoiceBase.playing = false;
                        VoiceBase.paused = false;
                        VoiceBase.autodj = false;
                        VoiceBase.repeat = false;
VoiceBase.repeatOnce = false;
                        VoiceBase.connection = null;
                        VoiceBase.textChannel = null;
                        VoiceBase.voiceChannel = null;
                        VoiceBase.queue.flush();
                    } catch (e) {}
                } else {
                    restart();
                }
            }
        } catch (e) {
            restart();
        }
    }

    if (fs.existsSync("./RESTART-FORCE")) {
        fs.rmSync("./RESTART-FORCE", {recursive: true});
        LogManager.warn("Force restart requested.");
        process.exit(14);
    }
}

setInterval(restartManager, 500);
global.systemRoot = __dirname;

if (!fs.existsSync("data")) fs.mkdirSync("data");
if (!fs.existsSync("data/cache")) fs.mkdirSync("data/cache");
if (!fs.existsSync("data/history.json")) fs.writeFileSync("data/history.json", "[]");
global.playbackHistory = JSON.parse(fs.readFileSync("data/history.json").toString());

let token = "";
if (fs.existsSync("token.txt")) token = fs.readFileSync("token.txt").toString().trim();
else if (fs.existsSync("../token.txt")) token = fs.readFileSync("../token.txt").toString().trim();
else {
    LogManager.error("Cannot find token in the expected places (" + __dirname + "/token.txt or " + __dirname.split("/").splice(__dirname.split("/").length - 1, 1).join("/") + "/token.txt");
    process.exit(1);
}

LogManager.verbose("Starting Discord bot...");
new DJPon3(token);