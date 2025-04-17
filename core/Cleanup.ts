import * as fs from 'fs';
import * as os from 'os';
import {LogManager} from "./LogManager";

export class Cleanup {
    public static cleanup() {
        LogManager.info("Cleanup: full");

        if (fs.existsSync("/tmp/stream.ogg")) {
            fs.rmSync("/tmp/stream.ogg");
        }

        fs.readdirSync("/tmp").filter((i) => {
            return i.startsWith("argon-stream");
        }).map((i) => {
            fs.rmSync("/tmp/" + i);
        })

        fs.readdirSync(os.tmpdir()).filter((i) => {
            return i.startsWith("argon-stream");
        }).map((i) => {
            fs.rmSync(os.tmpdir() + "/" + i);
        })
    }

    public static argonOnly() {
        LogManager.info("Cleanup: Argon only");

        fs.readdirSync("/tmp").filter((i) => {
            return i.startsWith("argon-stream");
        }).map((i) => {
            fs.rmSync("/tmp/" + i);
        })

        fs.readdirSync(os.tmpdir()).filter((i) => {
            return i.startsWith("argon-stream");
        }).map((i) => {
            fs.rmSync(os.tmpdir() + "/" + i);
        })
    }
}