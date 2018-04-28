const path = require("path");
const url = require("url");
const urlJoin = require("url-join");
const {app, BrowserWindow, session} = require("electron");


// Use a global reference for the window to prevent it from being garbage collected.
let appWindow;

function createAppWindow() {
    process.env.API_URL = process.env.API_URL || "http://localhost:8000/";
    process.env.STATIC_URL = process.env.STATIC_URL || "../../static/client/";
    process.env.BUNDLE_PATH = urlJoin(process.env.STATIC_URL, "/js/electron.bundle.js");
    process.env.FILLER_PIXEL_PATH = urlJoin(process.env.STATIC_URL, "/img/pixel.png");

    // Spoof the Referer header.
    const filter = {urls: ["http://*/*", "https://*/*"]};
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders["Referer"] = process.env.API_URL;
        callback({ cancel: false, requestHeaders: details.requestHeaders })
    });

    appWindow = new BrowserWindow({
        frame: false,
        height: 256,
        show: false,
        width: 256
    });
    appWindow.once("ready-to-show", appWindow.show);
    appWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
    }));
    appWindow.on("closed", () => appWindow = null);

    if (process.env.NODE_ENV !== "production") {
        appWindow.webContents.openDevTools({mode: "detach"});
    }
}

app.on("ready", createAppWindow);
app.on("window-all-closed", () => {
    // Exit the program when all the windows are closed except on Macs where programs need to be explicitly exited.
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    // On a Mac the program could be running with no windows. In that case the app window needs to be recreated when
    // the program is activated.
    if (appWindow === null) {
        createAppWindow();
    }
});
