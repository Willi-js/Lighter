const sidebar_extend = document.querySelector('.arrow-extend');
const sidebar = document.querySelector('.sidebar');
const thumb_container = document.querySelector('.track-thumb-container');
const thumb_container_line = document.querySelector('.track-thumb-container-line');
const track_display = document.querySelector('.track-display');
const editor = document.querySelector('.editor');

import library from "./library/library.js";

var states = {
    sidebar_extended: false,
    track_count: 0,
    possibleColors: ['red', 'blue', 'aqua', 'limegreen', 'aquamarine', 'cadetblue', 'crimson', 'darkmagenta', 'darkorange'],
    track_settings_on_track: null,
    tracks_array: [],
    settingsOn: false,
    settings: null,
    track_menu: null,
    scrollEl: null,
    playing: false,
    trackSplit: 0.12
}

var exports = {
    sidebar: sidebar,
    sidebar_extend: sidebar_extend,
    thumb_container: thumb_container,
    states: states,
    thumb_container_line: thumb_container_line,
    track_display: track_display,
    editor: editor
}

export default exports;

function calculateVolume(audioSegment) {
    let sum = 0;
    for (let i = 0; i < audioSegment.length; i++) {
        sum += Math.abs(audioSegment[i]);
    }
    const avg = sum / audioSegment.length;
    return Math.round(avg * 200);
}

function newProjectIinit() {
    sidebar_extend.addEventListener('click', () => {
        if(!states.sidebar_extended) {
            sidebar.style.width = '150px';
            sidebar_extend.style.rotate = '180deg';
            states.sidebar_extended = true;
            editor.style.width = 'calc(100% - 168px)';

        }  else {
            sidebar.style.width = '20px';
            sidebar_extend.style.rotate = '0deg';
            states.sidebar_extended = false;
            editor.style.width = 'calc(100% - 38px)';
        }
    });

    electron.get("config");
    electron.recieve((c) => {
       const config = JSON.parse(c);
       
       config.tracks.forEach(e => {

            if(!e.color) {
                e.color = track.background;
                electron.updateTrack(track.id, e);
            }


            const track = new library.Thumb(e.type, e.name, e.color, "load");

            const visualizerDiv = track.track;
            const pointer = visualizerDiv.getAttribute('data-pointer');
            const color = document.getElementById(pointer).getAttribute('data-color');

            if(e.samples.length === 0) return;

            var count = 0

            e.samples.forEach(s => {

                electron.processFile(s.sample);
                electron.recieve((fileBufferrrr) => {

                    count++;
                    if(count > e.samples.length) return;

                    const fileBuffer = JSON.parse(fileBufferrrr);

                    const arrayBuffer = new Uint8Array(fileBuffer.data).buffer;

                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                    try { async function a() {
                            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                            const audioData = audioBuffer.getChannelData(0);
                    
                            const sampleRate = audioBuffer.sampleRate;
                            const duration = audioBuffer.duration;
                            const interval = states.trackSplit;
                            const volumeData = [];
                    
                            for (let i = 0; i < duration; i += interval) {
                                const startSample = Math.floor(i * sampleRate);
                                const endSample = Math.floor((i + interval) * sampleRate);
                                const segment = audioData.slice(startSample, endSample);
                                const volume = calculateVolume(segment);
                                volumeData.push(volume);
                            }
                    
                            const vis = new library.Visualiser(track.track, color, "audio", s.place);
                            vis.drawLine(volumeData);
                        }
                        a();
                    } catch (error) {
                        console.error('Error decoding audio data:', error);
                    }

                    
                }, "process_file");
            });

       })
    }, "get");
}

newProjectIinit();

thumb_container_line.addEventListener('mousedown', (event) => {
    if(event.target.classList.value === 'track-thumb-container-line' && event.button === 2) {
        new library.TrackThumbMenu(event.clientX, event.clientY);
    };
});

thumb_container_line.addEventListener('wheel', () => {
    states.scrollEl = thumb_container_line;
});

track_display.addEventListener('wheel', () => {
    states.scrollEl = track_display;
});

thumb_container_line.addEventListener('scroll', () => {
    if(states.scrollEl === thumb_container_line) {
        track_display.scrollTop = thumb_container_line.scrollTop;
    }
});

track_display.addEventListener('scroll', () => {
    if(states.scrollEl === track_display) {
        thumb_container_line.scrollTop = track_display.scrollTop;
    }
});

addEventListener('keydown', e => {
    if(e.altKey && e.key.toLowerCase() === 'r') {
        electron.updatePlugins();
        window.location.reload();
    }
});

const playbtn = document.getElementById('play-btn');

const playcolmn = document.createElement('div');
track_display.appendChild(playcolmn);
playcolmn.style.position = 'absolute';
playcolmn.style.width = '1px';
playcolmn.style.height = '100%';
playcolmn.style.top = '0px';
playcolmn.style.backgroundColor = 'white';
playcolmn.style.display = 'none';

var playframe = 0;
var playcolumnpx = 0;


function play() {
    if(states.playing === true) {
        setTimeout(() => {
            playcolmn.style.display = 'block';
            playcolmn.style.left = playcolumnpx + "px";
            playcolumnpx++;
            play();
        }, 1000 * states.trackSplit);
    } else {
        playframe = 0;
        playcolumnpx = 0;
        playcolmn.style.left = playcolumnpx + "px";
        playcolmn.style.display = 'none';
    }
}

playbtn.addEventListener('click', e => {
    if(states.playing === false) {
        states.playing = true;
        playbtn.src = '../assets/play-green.svg';
        playbtn.style.rotate = '0deg';
        play();
    } else {
        states.playing = false;
        playbtn.src = '../assets/play.svg';
        playbtn.style.rotate = '90deg';
    }
});

addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();

    if(key === " ") {
        if(states.playing === false) {
            states.playing = true;
            playbtn.src = '../assets/play-green.svg';
            playbtn.style.rotate = '0deg';
            play();
        } else {
            states.playing = false;
            playbtn.src = '../assets/play.svg';
            playbtn.style.rotate = '90deg';
        }
    }
});

electron.getPlugins();
electron.recieve(d => {
    const keys = Object.keys(d.plugins);
    const enabled = [];
    keys.forEach(key => {
        if(d.plugins[key] === true) {
            enabled.push(key);
        }
    });
    const files = [];
    enabled.forEach(e => {
        files.push(d.list[e]);
    });
    files.forEach(key => {
        electron.getPlugin(key);
        electron.recieve(da => {
            const script = document.createElement('script');
            script.type = "module";
            script.innerHTML = da;
            document.body.appendChild(script);
        }, "get_plugin");
    });
}, "get_plugins");