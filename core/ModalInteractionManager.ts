import {InteractionManager} from "./InteractionManager";
import {ModalSubmitInteraction} from "discord.js";
import {LogManager} from "./LogManager";
import {CommandAction} from "./CommandAction";
import {CommandInteractionManager} from "./CommandInteractionManager";

export class ModalInteractionManager extends InteractionManager {
    constructor(interaction: ModalSubmitInteraction) {
        super();
        LogManager.verbose("ModalInteractionManager: " + interaction.customId);

        let id = interaction.customId;

        if (id === "queueModal") {
            CommandInteractionManager.commands["add"].handle(new CommandAction("add", interaction, {"query": interaction.fields.getTextInputValue('queryInput')}));
        }
    }
}