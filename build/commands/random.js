"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomCommand = void 0;
const CommandBase_1 = require("../core/CommandBase");
const builders_1 = require("@discordjs/builders");
const CommandAction_1 = require("../core/CommandAction");
const discord_js_1 = require("discord.js");
const CommandInteractionManager_1 = require("../core/CommandInteractionManager");
class RandomCommand extends CommandBase_1.CommandBase {
    constructor() {
        super();
        this.slashCommandData = new builders_1.SlashCommandBuilder()
            .setName("random")
            .setDescription("Picks a random item from the history and adds it to the queue");
    }
    handle(action) {
        let interaction = action.getInteraction();
        if (global.VoiceBase.autodj) {
            interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setDescription(":robot: This command does not work when auto DJ is enabled.")
                ]
            });
            return;
        }
        let items = global.playbackHistory.map((i) => {
            return i.url;
        });
        let item = items[Math.floor(Math.random() * items.length)];
        CommandInteractionManager_1.CommandInteractionManager.commands["add"].handle(new CommandAction_1.CommandAction("add", interaction, { "query": item }));
    }
}
exports.RandomCommand = RandomCommand;
//# sourceMappingURL=random.js.map