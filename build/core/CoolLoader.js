"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolLoader = void 0;
let messages = [
    `"It's not a bug, it's a feature!" - Scoots`,
    `"We're torturing the bot" - Twi`,
    `"When your /ping command doesn't work" - Twi`,
    `"Bitch what are you doing?" - Twi`,
    `"Pause it more" - Twi`,
    `"It won't recover on its own?" - Twi`,
    `"Obviously the bot shit itself" - Scoots`,
    `"Internetn't" - Twi`,
    `"Maybe it was fed up of the boops" - Twi`,
    `"What are you doing weird bot?" - Twi`,
    `"It crashed so I'm deploying a totally unrelated update" - Scoots`,
    `"Feature!" - Twi`,
    `"dead" - Twi`,
    `"bugs™" - Twi`,
    `"Nah it's a feature" - Scoots`,
    `"Oh heck" - Twi`,
    `"I wonder if that makes the bot unresponsive" - Scoots`,
    `"Oh nice it's behaving" - Twi`,
    `"You now get the full song, a capella and instrumental" - Twi`,
    `"Wanted only a single song, not 3" - Scoots`,
    `"Streams not supposed; reason: laziness" - Twi`,
    `"Is the bot okay- oh there we go" - Twi`,
    `"What the-" - Scoots`,
    `"ffff wrong button" - Scoots`,
    `"I think the websocket was closed before the connection was established" - Twi`,
    `"Oh damn that's an error!" - Twi`,
    `"Kill it while you still can" - Twi`,
    `"When there's a problem, always blame it on proprietary stuff" - Scoots`,
    `"This bot is broken in terms of metadata" - Scoots`,
    `"Welp no lyrics" - Scoots`,
    `"Don't worry it's broken" - Scoots`,
    `"The bot was left alone for 30ms" - Twi`,
    `"lmao what" - Scoots`,
    `"The return" - Twi`,
    `"Use /join and then click the funky buttons" - Scoots`,
    `"Because why the hell not" - Twi`,
    `"And 1 other item" - Twi`,
    `"You're at Microsoft's HQ, do you really expect things to work?" - Scoots`,
    `"stopping me from playing my radio" - Twi`,
    `"Wait... IT'S DOWNLOADING DIRECTLY TO YOUR TEMP" - Twi`,
];
class CoolLoader {
    static message() {
        return messages[Math.floor(Math.random() * messages.length)];
    }
}
exports.CoolLoader = CoolLoader;
//# sourceMappingURL=CoolLoader.js.map