const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');

function createMainWindow() {
    const mainWindonw = new BrowserWindow({
        title: 'Lighter',
        width: 1000,
        height: 700,
        icon: path.join(__dirname, './start_up/logo.ico'),
        minHeight: 600,
        minWidth: 520,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    ipcMain.handle('new_project', () => {
        mainWindonw.close();
        createEditorWindow();
    });

    mainWindonw.loadFile(path.join(__dirname, './start_up/index.html'));
}

function loadPreferenceWindow() {
    const preferenceWindow = new BrowserWindow({
        title: 'Lighter preferences',
        width: 400,
        height: 700,
        icon: path.join(__dirname, './start_up/logo.ico'),
        minHeight: 700,
        minWidth: 400,
        maxHeight: 700,
        maxWidth: 400
    });

    preferenceWindow.once('ready-to-show', () => {
       const menu = Menu.buildFromTemplate([]);
       Menu.setApplicationMenu(menu);
    });

    preferenceWindow.once('closed', () => {
        Menu.setApplicationMenu(editormenu);
    })
 
    preferenceWindow.loadFile(path.join(__dirname, './preferenceWindow/index.html'));
    console.log('Hi');
}

const editormenu = Menu.buildFromTemplate([
    {
        label: 'Lighter',
        submenu: [
            {
                label: 'Quit',
                click: () => app.quit(),
                accelerator: 'CmdOrCtrl+Q'
            },
            {
                label: 'Preferences',
                click: () => loadPreferenceWindow(),
                accelerator: 'CmdOrCtrl+P'
            }
        ]
    }
]);

function createEditorWindow() {
    const editorWindonw = new BrowserWindow({
        title: 'Lighter',
        width: 1300,
        height: 700,
        icon: path.join(__dirname, './start_up/logo.ico'),
        minHeight: 350,
        minWidth: 1300,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    editorWindonw.webContents.openDevTools();

    
    Menu.setApplicationMenu(editormenu);

    editorWindonw.loadFile(path.join(__dirname, './editor/index.html'));
}


app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().lenght === 0) {
            createMainWindow();
        }
    });

});
