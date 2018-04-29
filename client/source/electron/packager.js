const packager = require("electron-packager");
const {join, normalize} = require("path");


const resources = [
    normalize(""),
    normalize("/package.json"),
    normalize("/electron"),
    normalize("/electron/index.html"),
    normalize("/electron/main.bundle.js")
];

packager({
    asar: true,
    dir: join(__dirname, "../"),
    ignore: path => !resources.includes(normalize(path)),
    name: "Muse",
    out: join(__dirname, "..", "..", "..", "media", "dist"),
    overwrite: true
});
