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
    getTrack: (i) => {
        ipcRenderer.invoke('get_track', i);
    },
    processFile: (pathto) => {
        ipcRenderer.invoke('process_file', pathto);
    },
    openPlugins: () => {
        ipcRenderer.invoke('open_plugins');
    },
    getPluginList: () => {
        ipcRenderer.invoke('get_plugin_list');
    },
    updatePlugins: () => {
        ipcRenderer.invoke('update_plugins');
    },
    getPlugins: () => {
        ipcRenderer.invoke('get_plugins');
    },
    getPlugin: (p) => {
        ipcRenderer.invoke('get_plugin', p);
    },
    updatePlugin: (name, data) => {
        ipcRenderer.invoke('update_plugin', name, data);
    },
    getExplPath: () => {
        ipcRenderer.invoke('get_expl_path');
    },
    readExplorer: (d, c, i) => {
        ipcRenderer.invoke('read_explorer', d, c, i);
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
