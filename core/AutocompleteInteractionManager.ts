import {InteractionManager} from "./InteractionManager";
import {AutocompleteInteraction} from "discord.js";
import {LogManager} from "./LogManager";
import Fuse from "fuse.js";

export class AutocompleteInteractionManager extends InteractionManager {
    constructor(interaction: AutocompleteInteraction) {
        super();
        LogManager.verbose("AutocompleteInteractionManager");

        const fuse = new Fuse(global.playbackHistory, {
            keys: ['title', 'url']
        })

        LogManager.info("Autocomplete: " + interaction.options.getString("query"))
        let results = fuse.search(interaction.options.getString("query"));

        // @ts-ignore
        interaction.respond(results.filter((i) => i.item['url'].length <= 100).filter((_, i) => i < 21).map((i) => {
            return {
                name: i.item['title'].substring(0, 100),
                value: i.item['url']
            }
        }));
    }
}