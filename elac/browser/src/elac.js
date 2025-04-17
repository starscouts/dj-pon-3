class ELACData extends Object {
    constructor(obj) {
        super();

        for (let key of Object.keys(obj)) {
            this[key] = obj[key];
        }
    }
}

class ELACAudioStream extends Object {
    constructor(obj) {
        super();

        for (let key of Object.keys(obj)) {
            this[key] = obj[key];
        }
    }
}

class ELACError extends Error {
    constructor(props) {
        super(props);
        this.name = "ELACError";
    }
}

window.ELAC = {
    _base64ToArrayBuffer: (base64) => {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    },

    isELACData: async (data) => {
        return data instanceof ELACData && data["_eqmc"];
    },

    isELACAudioStream: async (data) => {
        return data instanceof ELACAudioStream && data["data"];
    },

    create: async (file) => {
        try {
            return new ELACData(JSON.parse(new TextDecoder("utf-8").decode(pako.inflate(new Uint8Array((await (await (await window.fetch(file)).blob()).arrayBuffer()))))));
        } catch (e) {
            console.error(e);
            throw new ELACError("Failed to construct ELACData object");
        }
    },

    decodeFile: async (data, file) => {
        if (!await ELAC.isELACData(data)) throw new ELACError("Invalid input, expected ELACData");

        if (data.files.length - 1 >= file) {
            let s = data.files[file];
            s["data"] = new Blob([pako.inflate(ELAC._base64ToArrayBuffer(s.data))]);
            return new ELACAudioStream(s);
        } else {
            throw new ELACError("File index is out of range");
        }
    },

    toAudio: async (data) => {
        if (!await ELAC.isELACAudioStream(data)) throw new ELACError("Invalid input, expected ELACAudioStream");

        return new Audio(window.URL.createObjectURL(data.data));
    },

    quickAudio: async (url, id) => {
        let elac = await ELAC.create(url);
        let file = await ELAC.decodeFile(elac, id);
        return await elac.toAudio(file);
    },

    quickBlob: async (url, id) => {
        let elac = await ELAC.create(url);
        let file = await ELAC.decodeFile(elac, id);
        return window.URL.createObjectURL(file.data);
    }
}