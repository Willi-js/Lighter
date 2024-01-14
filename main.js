const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const path = require('path');
const fs = require('fs');

const states = {
    projectPath: "",
}


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

    function createProject() {

        dialog.showOpenDialog(mainWindonw, {properties: ['openDirectory']}).then(res => {
            if(!res.canceled) {
                states.projectPath = res.filePaths[0];

                const samples = fs.mkdirSync(path.join(states.projectPath, '/samples'));
                const config = fs.writeFileSync(path.join(states.projectPath, '/config.json'), JSON.stringify({}));
                const projectFile = fs.writeFileSync(path.join(states.projectPath, '/project.lighter'),
                `
sampledata=${states.projectPath}/samples
configs=${states.projectPath}/config.json
root=${states.projectPath}
metadata=${states.projectPath}/metadata
                `);
                const meta = fs.mkdirSync(path.join(states.projectPath, '/metadata'));

                mainWindonw.close();
                createEditorWindow();
            }
        });
    }

    function openProject() {
        dialog.showOpenDialog(mainWindonw, {properties: ['openDirectory']}).then(res => {
            if(!res.canceled) {
                states.projectPath = res.filePaths[0];

                mainWindonw.close();
                createEditorWindow();
            }
        });
    }
    

    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    ipcMain.handle('new_project', () => {
        createProject();
    });

    ipcMain.handle("open_project", () => {
        openProject();
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
            },
        ]
    }
]);

function getKey(key) {
    return key;
}

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

    ipcMain.handle("get", (e, key) => {
        var ansswer = getKey(key);

        e.sender.send("get", ansswer);
    });
}


app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().lenght === 0) {
            createMainWindow();
        }
    });

});
