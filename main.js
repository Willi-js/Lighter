const {app, BrowserWindow, Menu, ipcMain, dialog, shell} = require('electron');
const path = require('path');
const fs = require('fs');
const preload = require("./helpers/preload");
const os = require('os');

const states = {
    projectPath: "",
    plugins: ""
}

function createMainWindow() {
    const mainWindonw = new BrowserWindow({
        title: 'Lighter',
        width: 1000,
        height: 700,
        icon: path.join(__dirname, os.platform() === 'win32' ? './start_up/logo.ico' : 'logo.png'),
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

                const configs = {
                    tracks: [
                        {
                            name: "0 audio",
                            samples: [],
                            type: "audio",
                        },
                        {
                            name: "1 MIDI",
                            samples: [],
                            type: "MIDI",
                        }
                    ]
                }

                const samples = fs.mkdirSync(path.join(states.projectPath, '/samples'));
                const config = fs.writeFileSync(path.join(states.projectPath, '/config.json'), JSON.stringify(configs, null, 2));
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
    states.plugins = path.join(__dirname, './Plugins');
    preload(states);
}

function loadPreferenceWindow() {
    const preferenceWindow = new BrowserWindow({
        title: 'Lighter preferences',
        width:  700,//400,
        height: 700,
        icon: path.join(__dirname, os.platform() === 'win32' ? './start_up/logo.ico' : 'logo.png'),
        minHeight: 700,
        minWidth: 700, //400,
        maxHeight: 700,
        maxWidth: 400,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    preferenceWindow.once('ready-to-show', () => {
       const menu = Menu.buildFromTemplate([]);
       Menu.setApplicationMenu(menu);
    });

    preferenceWindow.once('closed', () => {
        Menu.setApplicationMenu(editormenu);
    });

    preferenceWindow.webContents.openDevTools();
 
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
    switch (key) {
        case "config": {
            return fs.readFileSync(path.join(states.projectPath, '/config.json'), "utf-8");
        }
    }
}

function createEditorWindow() {
    const editorWindonw = new BrowserWindow({
        title: 'Lighter',
        width: 1300,
        height: 700,
        icon: path.join(__dirname, os.platform() === 'win32' ? './start_up/logo.ico' : 'logo.png'),
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

ipcMain.handle("get", (e, key, ID) => {
    var ansswer = getKey(key);

    e.sender.send("get", ansswer, ID);
});

ipcMain.handle("update", (e, key, value, ID) => {
    states[key] = value;
});

ipcMain.handle("add_sample", (e, name, data) => {
    fs.copyFileSync(data.path, path.join(states.projectPath, '/samples/', name));

    const config = JSON.parse(getKey("config"));
    config.tracks[data.id].samples.push({
        sample: name,
        place: data.place
    });

    fs.writeFileSync(path.join(states.projectPath, '/config.json'), JSON.stringify(config, null, 2));
});

ipcMain.handle("update_track", (e, i, d) => {

    if(d === "trash") {
        const config = JSON.parse(getKey("config"));
        config.tracks.splice(i, 1);
        fs.writeFileSync(path.join(states.projectPath, '/config.json'), JSON.stringify(config, null, 2));
        return;
    }

    const config = JSON.parse(getKey("config"));
    config.tracks[i] = d;
    fs.writeFileSync(path.join(states.projectPath, '/config.json'), JSON.stringify(config, null, 2));

});

ipcMain.handle("add_track", (e, d) => {
    const config = JSON.parse(getKey("config"));
    config.tracks.push(d);
    fs.writeFileSync(path.join(states.projectPath, '/config.json'), JSON.stringify(config, null, 2));
});

ipcMain.handle("process_file", async (e, d) => {
    var d = path.join(states.projectPath, '/samples/', d);
    const fileBuffer = fs.readFileSync(d);

    e.sender.send("process_file", JSON.stringify(fileBuffer));
});

ipcMain.handle("open_plugins", () => {
    shell.openPath(path.join(__dirname, './Plugins'));
});

ipcMain.handle("update_plugins", () => {
    preload(states);
});

ipcMain.handle("get_plugin_list", e => {
    const plugins = JSON.parse(fs.readFileSync(states.plugins+"/config.json"));
    e.sender.send("get_plugin_list", plugins.plugins);
});

ipcMain.handle("get_plugins", (e) => {
    const cnf = JSON.parse(fs.readFileSync(states.plugins+"/config.json"));

    e.sender.send("get_plugins", cnf);
});

ipcMain.handle("get_plugin", (e, p) => {
    const cnf = fs.readFileSync(states.plugins+`/${p}`, "utf-8");

    e.sender.send("get_plugin", cnf);
});

ipcMain.handle("update_plugin", (e, n, d) => {
    const cnf = JSON.parse(fs.readFileSync(states.plugins+"/config.json"));
    cnf.plugins[n] = d;
    fs.writeFileSync(states.plugins+"/config.json", JSON.stringify(cnf, null, 2));
});

ipcMain.handle("get_track", (e, i) => {
    const config = JSON.parse(getKey("config"));
    e.sender.send("get_track", config.tracks[i]);
});

ipcMain.handle('get_expl_path', (e) => {
    e.sender.send('get_expl_path', path.join(__dirname, "./Explorer"));
});

ipcMain.handle('read_explorer', (e, d, c, i) => {
    if(d === undefined) {
        const out = [];
        fs.readdirSync(path.join(__dirname, "./Explorer")).forEach(file => {

            if(file === "linker.link") {

                try {
                    const linkTo = fs.readFileSync(path.join(d, file), "utf-8");

                    if(linkTo !== "none" && linkTo !== "") {

                        fs.readdirSync(linkTo).forEach(file => {
    
                            out.push({
                                name: file,
                                path: path.join(linkTo, file),
                                type: fs.statSync(path.join(linkTo, file)).isDirectory() ? "folder" : "file",
                                color: undefined,
                                index: undefined,
                                isMain: true
                            });
    
                        });
    
                    }

                } catch {}
                
            } else {
                out.push({
                    name: file,
                    path: path.join(__dirname, "./Explorer/", file),
                    type: fs.statSync(path.join(__dirname, `./Explorer/`, file)).isDirectory() ? "folder" : "file",
                    color: undefined,
                    index: undefined,
                    isMain: true
                });
            }
            
        });
        e.sender.send('read_explorer', out);
    } else {
        const out = [];
        fs.readdirSync(path.join(d)).forEach(file => {

            if(file === "linker.link") {

                try {

                    const linkTo = fs.readFileSync(path.join(d, file), "utf-8");

                    if(linkTo !== "none" && linkTo !== "") {
                    
                        fs.readdirSync(linkTo).forEach(file => {
                        
                            out.push({
                                name: file,
                                path: path.join(linkTo, file),
                                type: fs.statSync(path.join(linkTo, file)).isDirectory() ? "folder" : "file",
                                color: c,
                                index: i,
                                isMain: false
                            });
                            
                        });
                    
                    }

                } catch {}

            } else {
                out.push({
                    name: file,
                    path: path.join(d, file),
                    type: fs.statSync(path.join(d, file)).isDirectory() ? "folder" : "file",
                    color: c,
                    index: i,
                    isMain: false
                });
            }
        });
        e.sender.send('read_explorer', out);
    }
});

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().lenght === 0) {
            createMainWindow();
        }
    });

});
