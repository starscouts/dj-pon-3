import {CommandBase} from "../core/CommandBase";
import {SlashCommandBuilder} from "@discordjs/builders";
import * as os from 'os';
import * as fs from 'fs';
import {CommandAction} from "../core/CommandAction";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {LogManager} from "../core/LogManager";

export class AboutCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("about")
            .setDescription("Gets diagnostics information from the bot")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();
        let VoiceBase = global.VoiceBase;

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(":sos: Diagnostics Information")
                    .setDescription(global.client.user.username + " version " + global.version + ", build " + global.build + "\n    on Node.js " + process.versions.node + " " + process.arch + "\n    on " + os.type() + " " + os.arch() + " " + os.release() + "\n    on " + os.hostname() + "\n" + (
                        fs.existsSync("./RESTART") ? (
                            ":warning: Update to version " + (fs.existsSync("./.git/refs/heads/mane") ? fs.readFileSync("./.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("../.git/refs/heads/mane") ? fs.readFileSync("../.git/refs/heads/mane").toString().trim().substring(0, 8) : (fs.existsSync("./version.txt") ? fs.readFileSync("./version.txt").toString().trim() : (fs.existsSync("../version.txt") ? fs.readFileSync("../version.txt").toString().trim() : "live")))) + ", build " + (fs.existsSync("./build.txt") ? fs.readFileSync("./build.txt").toString().trim() : (fs.existsSync("../build.txt") ? fs.readFileSync("../build.txt").toString().trim() : "dev")) + " pending."
                        ) : ("")
                    ))
                    .addField("System Information", "" +
                        "**PID:** " + process.pid + ", running as " + os.userInfo().username + " (" + os.userInfo().uid + ":" + os.userInfo().gid + ")\n" +
                        "**Path:** " + global.systemRoot + "\n"
                    )
                    .addField("Bot Information", "" +
                        "**User ID:** " + global.client.user.id + "\n" +
                        "**Imported modules:** " + Object.keys(require.cache).length + "\n" +
                        "**Used RAM:** " + Math.round(process.memoryUsage().heapTotal / (1024 ** 2)) + " MiB\n" +
                        "**Connection date:** " + global.client.readyAt.toISOString()
                    )
                    .addField("Voice Connectivity", "" +
                        (VoiceBase.connected ? (
                            "**State:** " + (VoiceBase.connected ? "Connected, " : "") + (VoiceBase.playing ? "Playing, " : "") + (VoiceBase.paused ? "Paused, " : "") + (VoiceBase.repeat ? "Repeating (queue), " : "") + (VoiceBase.autodj ? "Auto DJ, " : "") + (VoiceBase.repeatOnce ? "Repeating (song), " : "") + "\n" +
                            "**Linked Channels:** <#" + VoiceBase.textChannel.id + ">, <#" + VoiceBase.voiceChannel.id + ">" + "\n" +
                            "**Queue Length:** " + (VoiceBase.autodj ? "∞" : VoiceBase.queue.list().length) + "/" + global.playbackHistory.length + "\n" +
                            "**Current Song:** " + (VoiceBase.playing ? (
                                "[" + VoiceBase.currentSong.title.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").replace(/]/gm, "\\]").replace(/\[/gm, "\\[") + "](" + VoiceBase.currentSong.url + ") (" + VoiceBase.currentSong.source + ", `" + new Date(VoiceBase.currentSong.length * 1000).toISOString().substring(14, 19) + "`)"
                            ) : (
                                "*Not applicable*"
                            ))
                        ) : (
                            "*Not connected*"
                        ))
                    )
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Source Code')
                            .setStyle('LINK')
                            .setURL("https://git.equestria.dev/equestria.dev/dj-pon-3"),
                        new MessageButton()
                            .setLabel('Roadmap')
                            .setStyle('LINK')
                            .setURL("https://git.equestria.dev/equestria.dev/dj-pon-3/src/branch/mane/TODO.md"),
                        new MessageButton()
                            .setLabel('General Information')
                            .setStyle('LINK')
                            .setURL("https://git.equestria.dev/equestria.dev/dj-pon-3/src/branch/mane/README.md"),
                    )
            ]
        }).then(() => {
            LogManager.info("/about: dispatched GUI info");
        })
        return;
    }
}
