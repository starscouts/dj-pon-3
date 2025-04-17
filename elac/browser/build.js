const fs = require('fs');

let files = [];
files.push(fs.readFileSync("./src/pako.js").toString());
files.push(fs.readFileSync("./src/elac.js").toString());

fs.writeFileSync("./elac.js", files.join("\n\n\n"));