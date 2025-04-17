"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURL = void 0;
const youtube_validator_1 = __importDefault(require("youtube-validator"));
function validateURL(url) {
    return new Promise((res) => {
        youtube_validator_1.default.validateUrl(url, (out, err) => {
            console.error(err);
            if (err)
                res(false);
            res(true);
        });
    });
}
exports.validateURL = validateURL;
//# sourceMappingURL=URLValidator.js.map