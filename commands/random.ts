import {CommandBase} from "../core/CommandBase";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandAction} from "../core/CommandAction";
import {MessageEmbed} from "discord.js";
import {CommandInteractionManager} from "../core/CommandInteractionManager";

export class RandomCommand extends CommandBase {
    constructor() {
        super();
        this.slashCommandData = new SlashCommandBuilder()
            .setName("random")
            .setDescription("Picks a random item from the history and adds it to the queue")
    }

    public handle(action: CommandAction) {
        let interaction = action.getInteraction();

        if (global.VoiceBase.autodj) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            })
            return;
        }

        let items = global.playbackHistory.map((i) => {
            return i.url;
        });
        let item = items[Math.floor(Math.random() * items.length)];

        CommandInteractionManager.commands["add"].handle(new CommandAction("add", interaction, {"query": item}));
    }
}
