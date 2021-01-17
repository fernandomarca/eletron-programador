const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    globalShortcut,
} = require("electron");
const path = require("path");
const os = require("os");

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
        win.webContents.send("cpu_name", os.cpus()[0].model);
    });

    const menuTemplate = [
        { role: "appMenu" },
        { role: "fileMenu" },
        { role: "zoom" },
        { role: "editMenu" },
        {
            label: "Window",
            submenu: [
                {
                    label: "New Window",
                    click: () => {
                        createWindow();
                    },
                },
                { type: "separator" },
                {
                    label: "Close all Windows",
                    accelerator: "CommandOrControl+e",
                    click: () => {
                        BrowserWindow.getAllWindows().forEach((window) => {
                            window.close();
                        });
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow();
    globalShortcut.register("cmdOrCtrl+d", () => {
        console.log("atalho executado");
        BrowserWindow.getAllWindows()[0].setAlwaysOnTop(true);
        BrowserWindow.getAllWindows()[0].setAlwaysOnTop(false);
    });
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

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

ipcMain.on("open_new_window", () => {
    createWindow();
});
