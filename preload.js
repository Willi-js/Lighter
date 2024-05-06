const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
    newProject: () => ipcRenderer.invoke('new_project'),
    openProject: () => ipcRenderer.invoke('open_project'),
    get: (key, ID) => {
        ipcRenderer.invoke('get', key, ID);
    },
    recieve: (callback, ch) => {
        ipcRenderer.on(ch, (e, args, ID) => {
            callback(args, ID);
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
    getTrack: (i, ID) => {
        ipcRenderer.invoke('get_track', i, ID);
    },
    processFile: (pathto, ID) => {
        ipcRenderer.invoke('process_file', pathto, ID);
    },
    openPlugins: () => {
        ipcRenderer.invoke('open_plugins');
    },
    getPluginList: (ID) => {
        ipcRenderer.invoke('get_plugin_list', ID);
    },
    updatePlugins: () => {
        ipcRenderer.invoke('update_plugins');
    },
    getPlugins: (ID) => {
        ipcRenderer.invoke('get_plugins', ID);
    },
    getPlugin: (p, ID) => {
        ipcRenderer.invoke('get_plugin', p, ID);
    },
    updatePlugin: (name, data) => {
        ipcRenderer.invoke('update_plugin', name, data);
    },
    getExplPath: (ID) => {
        ipcRenderer.invoke('get_expl_path', ID);
    },
    readExplorer: (d, c, i, ID) => {
        ipcRenderer.invoke('read_explorer', d, c, i, ID);
    },
    followLinker: (p) => {
        ipcRenderer.invoke('follow_linker', p);
    }
});

contextBridge.exposeInMainWorld('path', {
    path: path
});

contextBridge.exposeInMainWorld('fs', {
    fs: fs
});
