const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
    newProject: () => ipcRenderer.invoke('new_project')
});

contextBridge.exposeInMainWorld('path', {
    path: path
});

contextBridge.exposeInMainWorld('fs', {
    fs: fs
});
