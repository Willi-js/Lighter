import mainFile from '../main.js';
import Settings from './settings.js';
import Visualiser from './spawnVisualiser.js';
import ThumbSelect from './thumbSelect.js';

function calculateVolume(audioSegment) {
    let sum = 0;
    for (let i = 0; i < audioSegment.length; i++) {
        sum += Math.abs(audioSegment[i]);
    }
    const avg = sum / audioSegment.length;
    return Math.round(avg * 100);
}

export default class Thumb {
    constructor(type = 'audio') {

        mainFile.states.tracks_array.push(this);

        this.object = document.createElement('div');
        mainFile.states.track_count = mainFile.states.track_count+1;

        this.id = mainFile.states.tracks_array.indexOf(this);
        this.type = type;
        this.background = mainFile.states.possibleColors[Math.floor(Math.random()*mainFile.states.possibleColors.length)];
        this.object.setAttribute('data-color', this.background);
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
        this.track_settings.src = '../assets/arrow.svg';
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
        });

        this.track = document.createElement('div');
        mainFile.track_display.append(this.track);
        this.track.classList = 'track';
        this.track.setAttribute("data-pointer", this.id);
        this.track.style.display = 'flex';

        var track = this.track;

        this.track.addEventListener('dragover', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });

        this.track.addEventListener('drop', async function (event) {
            event.preventDefault();

            const visualizerDiv = event.target;
            const pointer = visualizerDiv.getAttribute('data-pointer');
            const color = document.getElementById(pointer).getAttribute('data-color');

            const file = event.dataTransfer.files[0];

            if (!file || file.type !== 'audio/mpeg') {
                return;
            }

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const reader = new FileReader();

            reader.onload = async function (event) {
                const arrayBuffer = event.target.result;
                try {
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    const audioData = audioBuffer.getChannelData(0); 

                    const sampleRate = audioBuffer.sampleRate;
                    const duration = audioBuffer.duration;
                    const interval = 0.2; 
                    const volumeData = [];

                    for (let i = 0; i < duration; i += interval) {
                        const startSample = Math.floor(i * sampleRate);
                        const endSample = Math.floor((i + interval) * sampleRate);
                        const segment = audioData.slice(startSample, endSample);
                        const volume = calculateVolume(segment);
                        volumeData.push(volume);
                    }

                    new Visualiser(track, color).drawLine(volumeData);
                } catch (error) {
                    console.error('Error decoding audio data:', error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
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
        this.track.remove();

        if(this.settingsOn) {
            mainFile.states.settings.remove();
            this.settingsOn = false;
            mainFile.states.settingsOn = false;
            mainFile.states.track_settings_on_track = null;
            mainFile.states.settings = null;
        }

        mainFile.states.tracks_array.splice(this.id, 1)

        mainFile.states.tracks_array.forEach(item => {
            item.updateId();
        });
    }
}
