import mainFile from "../main.js";

export default class Settings {
    constructor(name) {

        if(!mainFile.states.settingsOn) {

            mainFile.states.settingsOn = true;

            this.settings = document.createElement('div');
            mainFile.thumb_container.append(this.settings);
            this.settings.classList = 'settings-bar';
            mainFile.states.settings = this;

            this.title_container = document.createElement('div');
            this.settings.append(this.title_container);
            this.title_container.classList = 'title-container';

            this.title = document.createElement('p');
            this.title_container.append(this.title);
            this.title.classList = 'settings-title';
            this.title.textContent = name;
             
        } else {
            mainFile.states.settings.title.textContent = name;
        }
    }

    remove() {
        mainFile.states.settingsOn = false;
        this.settings.remove();
    }

    updateTitle(name) {
        this.title.textContent = name;
    }
}