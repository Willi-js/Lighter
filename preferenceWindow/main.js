const pluginsf = document.querySelector(".open-folder");

pluginsf.addEventListener('click', () => {
    electron.openPlugins();
});

electron.getPluginList();
electron.recieve(d => {
    console.log(d);
}, "get_plugin_list");