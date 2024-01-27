const pluginsf = document.querySelector(".open-folder");
const pluginList = document.querySelector(".plugin-list");

class PluginEl {
    constructor(name, value) {
        this.name = name;
        this.container = document.createElement('div');
        this.container.classList = 'plugin';
        this.nameE = document.createElement('p');
        this.container.append(this.nameE);
        this.nameE.classList = 'plugin-name';
        this.nameE.textContent = name;
        this.pluginBtn = document.createElement('div');
        this.container.append(this.pluginBtn);
        this.pluginBtn.classList = `back ${value}`;
        this.pluginBtn.innerHTML = '<div></div>';
        pluginList.append(this.container);

        this.pluginBtn.addEventListener('click', (ev) => {
            if(this.pluginBtn.classList.contains("true")) {
                this.pluginBtn.classList.remove("true");
                this.pluginBtn.classList.add("false");
                electron.updatePlugin(this.name, false);
            } else {
                this.pluginBtn.classList.remove("false");
                this.pluginBtn.classList.add("true");
                electron.updatePlugin(this.name, true);
            }
        });
    }
}

pluginsf.addEventListener('click', () => {
    electron.openPlugins();
});

electron.getPluginList();
electron.recieve(d => {
    const tokens = Object.keys(d);

    tokens.forEach(key => {
        new PluginEl(key, d[key]);
    });

}, "get_plugin_list");