const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
    newProject: () => ipcRenderer.invoke('new_project'),
    openProject: () => ipcRenderer.invoke('open_project'),
    get: (key) => {
        ipcRenderer.invoke('get', key);
    },
    recieve: (callback, ch) => {
        ipcRenderer.on(ch, (e, args) => {
            callback(args);
        });
    },
    update: (key, value) => {
        ipcRenderer.invoke('update', key, value);
    },
    addSample: (name, data) => {
        ipcRenderer.invoke('add_sample', name, data);
    },
    updateTrack: (index, track) => {
        ipcRenderer.invoke('update_track', index, track);
    },
    addTrack: (data) => {
        ipcRenderer.invoke('add_track', data);
    },
    processFile: (pathto) => {
        ipcRenderer.invoke('process_file', pathto);
    }
});

contextBridge.exposeInMainWorld('path', {
    path: path
});

contextBridge.exposeInMainWorld('fs', {
    fs: fs
});
