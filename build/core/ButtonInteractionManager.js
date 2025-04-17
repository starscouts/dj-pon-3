"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonInteractionManager = void 0;
const InteractionManager_1 = require("./InteractionManager");
const LogManager_1 = require("./LogManager");
const CommandAction_1 = require("./CommandAction");
const CommandInteractionManager_1 = require("./CommandInteractionManager");
const QueueModalCreator_1 = require("./QueueModalCreator");
class ButtonInteractionManager extends InteractionManager_1.InteractionManager {
    constructor(interaction) {
        super();
        LogManager_1.LogManager.verbose("ButtonInteractionManager: " + interaction.customId);
        let i = JSON.parse(interaction.customId);
        if (i._custom && i._custom === "addModal") {
            new QueueModalCreator_1.QueueModalCreator(interaction);
        }
        else {
            LogManager_1.LogManager.info("Running /" + i['command'] + " from button press");
            if (Object.keys(CommandInteractionManager_1.CommandInteractionManager.commands).includes(i['command'])) {
                CommandInteractionManager_1.CommandInteractionManager.commands[i['command']].handle(new CommandAction_1.CommandAction(i['command'], interaction, i['args']));
            }
            else {
                LogManager_1.LogManager.error("Command not found: " + i['command']);
                interaction.reply(":x: Command not found: `" + i['command'] + "`, this is most likely a bug.");
            }
        }
    }
}
exports.ButtonInteractionManager = ButtonInteractionManager;
//# sourceMappingURL=ButtonInteractionManager.js.map