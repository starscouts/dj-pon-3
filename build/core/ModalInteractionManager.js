"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalInteractionManager = void 0;
const InteractionManager_1 = require("./InteractionManager");
const LogManager_1 = require("./LogManager");
const CommandAction_1 = require("./CommandAction");
const CommandInteractionManager_1 = require("./CommandInteractionManager");
class ModalInteractionManager extends InteractionManager_1.InteractionManager {
    constructor(interaction) {
        super();
        LogManager_1.LogManager.verbose("ModalInteractionManager: " + interaction.customId);
        let id = interaction.customId;
        if (id === "queueModal") {
            CommandInteractionManager_1.CommandInteractionManager.commands["add"].handle(new CommandAction_1.CommandAction("add", interaction, { "query": interaction.fields.getTextInputValue('queryInput') }));
        }
    }
}
exports.ModalInteractionManager = ModalInteractionManager;
//# sourceMappingURL=ModalInteractionManager.js.map