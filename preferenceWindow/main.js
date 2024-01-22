const pluginsf = document.querySelector(".open-folder");

pluginsf.addEventListener('click', () => {
    electron.openPlugins();
});