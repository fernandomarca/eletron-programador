const path = require("path");
const { app, BrowserWindow } = require("electron");

const isDev =
    process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development"
        ? true
        : false;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Home",
        backgroundColor: "#123",
        darkTheme: true,
        show: false,
        icon: path.join(__dirname, "assets", "icons", "icon.png"),
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadFile("index.html");
    if (isDev) {
        win.webContents.openDevTools();
    }

    win.once("ready-to-show", () => {
        win.show();
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
