import {InteractionManager} from "./InteractionManager";
import {ButtonInteraction} from "discord.js";
import {LogManager} from "./LogManager";
import {CommandAction} from "./CommandAction";
import {CommandInteractionManager} from "./CommandInteractionManager";
import {QueueModalCreator} from "./QueueModalCreator";

export class ButtonInteractionManager extends InteractionManager {
    constructor(interaction: ButtonInteraction) {
        super();
        LogManager.verbose("ButtonInteractionManager: " + interaction.customId);

        let i = JSON.parse(interaction.customId);

        if (i._custom && i._custom === "addModal") {
            new QueueModalCreator(interaction);
        } else {
            LogManager.info("Running /" + i['command'] + " from button press")

            if (Object.keys(CommandInteractionManager.commands).includes(i['command'])) {
                CommandInteractionManager.commands[i['command']].handle(new CommandAction(i['command'], interaction, i['args']));
            } else {
                LogManager.error("Command not found: " + i['command']);
                interaction.reply(":x: Command not found: `" + i['command'] + "`, this is most likely a bug.");
            }
        }
    }
}