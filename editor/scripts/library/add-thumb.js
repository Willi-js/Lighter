import mainFile from '../main.js';
import Settings from './settings.js';
import ThumbSelect from './thumbSelect.js';

export default class Thumb {
    constructor(type = 'audio') {

        mainFile.states.tracks_array.push(this);

        this.object = document.createElement('div');
        mainFile.states.track_count = mainFile.states.track_count+1;

        this.id = mainFile.states.tracks_array.indexOf(this);
        this.type = type;
        this.background = mainFile.states.possibleColors[Math.floor(Math.random()*mainFile.states.possibleColors.length)];
        this.name = `${this.id} ${type}`;
        
        mainFile.thumb_container_line.append(this.object);
        this.object.classList = `track-thumb ${this.type}`;
        this.object.id =  this.id;
        this.object.style.backgroundColor = this.background;

        this.title = document.createElement('p');
        this.object.append(this.title);
        this.title.textContent = this.name;
        this.title.classList = 'title';

        this.button_container = document.createElement('div');
        this.object.append(this.button_container);
        this.button_container.classList = 'button-container';

        this.track_settings = document.createElement('img');
        this.button_container.append(this.track_settings);
        this.track_settings.src = '../assests/arrow.svg';
        this.track_settings.classList = 'track_button';
        this.settingsOn = false;
        
        this.track_settings.addEventListener('click', () => {
            if(!this.settingsOn) {
                this.track_settings.style.rotate = '180deg';
                this.settingsOn = true;

                if(mainFile.states.track_settings_on_track === null) {
                    mainFile.states.track_settings_on_track = this.id;
                } else {
                    mainFile.states.tracks_array[mainFile.states.track_settings_on_track].settingsOn = false;
                    mainFile.states.tracks_array[mainFile.states.track_settings_on_track].track_settings.style.rotate = '0deg';
                    mainFile.states.track_settings_on_track = this.id;
                }

                mainFile.thumb_container.style.width = '900px';
                mainFile.track_display.width = 'clac(100% - 900px)';

                this.settings = new Settings(this.name);

            } else {
                this.track_settings.style.rotate = '0deg';
                this.settingsOn = false;
                mainFile.states.track_settings_on_track = null;
                mainFile.thumb_container.style.width = '100px';
                mainFile.states.settings.remove();
                mainFile.track_display.width = 'clac(100% - 100px)';
            }
        });

        this.object.addEventListener('mousedown', event => {
            if(event.button === 2) {
                new ThumbSelect(this);
            }
        })
    }

    updateId() {
        this.id = mainFile.states.tracks_array.indexOf(this);
        this.object.id = this.id;
    }

    updateTitle(newtitle) {
        this.name = newtitle;
        this.title.textContent = this.name;
    }

    remove() {
        this.object.remove();
        mainFile.states.tracks_array.splice(this.id, 1)

        mainFile.states.tracks_array.forEach(item => {
            item.updateId();
        });
    }
}
