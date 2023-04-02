const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
    newProject: () => ipcRenderer.invoke('new_project')
});

contextBridge.exposeInMainWorld('path', {
    path: path
});
