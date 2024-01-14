const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
    newProject: () => ipcRenderer.invoke('new_project'),
    openProject: () => ipcRenderer.invoke('open_project'),
    get: (key) => {
        ipcRenderer.invoke('get', key);
    },
    recieve: (callback) => {
        ipcRenderer.on("get", (e, args) => {
            callback(args);
        });
    }
});

contextBridge.exposeInMainWorld('path', {
    path: path
});

contextBridge.exposeInMainWorld('fs', {
    fs: fs
});
