"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteInteractionManager = void 0;
const InteractionManager_1 = require("./InteractionManager");
const LogManager_1 = require("./LogManager");
const fuse_js_1 = __importDefault(require("fuse.js"));
class AutocompleteInteractionManager extends InteractionManager_1.InteractionManager {
    constructor(interaction) {
        super();
        LogManager_1.LogManager.verbose("AutocompleteInteractionManager");
        const fuse = new fuse_js_1.default(global.playbackHistory, {
            keys: ['title', 'url']
        });
        LogManager_1.LogManager.info("Autocomplete: " + interaction.options.getString("query"));
        let results = fuse.search(interaction.options.getString("query"));
        // @ts-ignore
        interaction.respond(results.filter((_, i) => i < 21).map((i) => {
            return {
                name: i.item['title'].substring(0, 100),
                value: i.item['url']
            };
        }));
    }
}
exports.AutocompleteInteractionManager = AutocompleteInteractionManager;
//# sourceMappingURL=AutocompleteInteractionManager.js.map