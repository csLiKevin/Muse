import {app, BrowserWindow, session} from "electron";
import {join} from "path";
import {format} from "url";
import urlJoin from "url-join";


// Use a global reference for the window to prevent it from being garbage collected.
let appWindow;

function createAppWindow() {
    // Store environment variables used by index.html.
    process.env.ELECTRON = JSON.stringify({
        apiUrl: process.env.API_URL,
        bundlePath: urlJoin(process.env.STATIC_URL, "js", "electron.bundle.js"),
        fillerPixelPath: urlJoin(process.env.STATIC_URL, "img", "pixel.png")
    });

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
    appWindow.loadURL(format({
        pathname: join(process.env.ELECTRON_DIRECTORY, "index.html"),
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
