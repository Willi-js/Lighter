import main from "../main.js";
import library from "./library.js";
import { complile_play } from "./play.js";
import { stopPlay } from "./play.js";

function calculateVolume(audioSegment) {
    let sum = 0;
    for (let i = 0; i < audioSegment.length; i++) {
        sum += Math.abs(audioSegment[i]);
    }
    const avg = sum / audioSegment.length;
    return Math.round(avg * 200);
}

function newProjectIinit() {

    const children = main.sidebarContent.children;
    for(let i = 0; i < children.length; i++) {
       children[i].style.display = "none";
    }


    main.sidebar_extend.addEventListener('click', () => {
        if(!main.states.sidebar_extended) {
            main.sidebar.style.width = '150px';
            main.sidebar_extend.style.rotate = '180deg';
            main.states.sidebar_extended = true;
            main.editor.style.width = 'calc(100% - 168px)';

            for(let i = 0; i < children.length; i++) {
                children[i].style.display = "flex";
            }

        }  else {
            main.sidebar.style.width = '20px';
            main.sidebar_extend.style.rotate = '0deg';
            main.states.sidebar_extended = false;
            main.editor.style.width = 'calc(100% - 38px)';

            for(let i = 0; i < children.length; i++) {
                children[i].style.display = "none";
            }

        }
    });

    electron.get("config", 1);
}

electron.recieve((c, pID) => {

    if(pID !== 1) return;

    const config = JSON.parse(c);
   
    config.tracks.forEach(e => {

        const track = new library.Thumb(e.type, e.name, e.color, "load");

        if(!e.color) {
            e.color = track.background;
            electron.updateTrack(track.id, e);
        }

        const visualizerDiv = track.track;
        const pointer = visualizerDiv.getAttribute('data-pointer');
        const color = document.getElementById(pointer).getAttribute('data-color');

        if(e.samples.length === 0) return;

        e.samples.forEach(s => {
            electron.processFile(s.sample, 2, s, e, color, visualizerDiv.getAttribute("data-pointer"));
        });

   });
}, "get");

electron.recieve((fileBufferrrr, pID, other) => {
    if (pID !== 2) return;

    const sample_dat = other[0];
    const e = other[1];
    const color = other[2];
    const track = document.querySelector(`div[data-pointer="${other[3]}"]`);

    const fileBuffer = JSON.parse(fileBufferrrr);

    const arrayBuffer = new Uint8Array(fileBuffer.data).buffer;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    try { async function a() {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const audioData = audioBuffer.getChannelData(0);
    
            const sampleRate = audioBuffer.sampleRate;
            const duration = audioBuffer.duration;
            const interval = main.states.trackSplit;
            const volumeData = [];
    
            for (let i = 0; i < duration; i += interval) {
                const startSample = Math.floor(i * sampleRate);
                const endSample = Math.floor((i + interval) * sampleRate);
                const segment = audioData.slice(startSample, endSample);
                const volume = calculateVolume(segment);
                volumeData.push(volume);
            }      

            const vis = new library.Visualiser(track, color, "audio", sample_dat.place);
            vis.drawLine(volumeData);
        }
        a();
    } catch (error) {
        console.error('Error decoding audio data:', error);
    }

    
}, "process_file");

function getEvents() {

    const vis_play = getVisPlay();

    main.thumb_container_line.addEventListener('mousedown', (event) => {
        if(event.target.classList.value === 'track-thumb-container-line' && event.button === 2) {
            new library.TrackThumbMenu(event.clientX, event.clientY);
        };
    });
    
    main.thumb_container_line.addEventListener('wheel', () => {
        main.states.scrollEl = main.thumb_container_line;
    });
    
    main.track_display.addEventListener('wheel', () => {
        main.states.scrollEl = main.track_display;
    });
    
    main.thumb_container_line.addEventListener('scroll', () => {
        if(main.states.scrollEl === main.thumb_container_line) {
            main.track_display.scrollTop = main.thumb_container_line.scrollTop;
        }
    });
    
    main.track_display.addEventListener('scroll', () => {
        if(main.states.scrollEl === main.track_display) {
            main.thumb_container_line.scrollTop = main.track_display.scrollTop;
        }
    });

    addEventListener('keydown', e => {
        if(e.altKey && e.key.toLowerCase() === 'r') {
            electron.updatePlugins();
            window.location.reload();
        }
    });

    const playbtn = document.getElementById('play-btn');

    playbtn.addEventListener('click', e => {
        if(main.states.playing === false) {
            main.states.playing = true;
            playbtn.src = '../assets/play-green.svg';
            playbtn.style.rotate = '0deg';
            vis_play();
            complile_play();
        } else {
            main.states.playing = false;
            playbtn.src = '../assets/play.svg';
            playbtn.style.rotate = '90deg';
            stopPlay();
        }
    });

    addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
    
        if(key === " ") {
            if(main.states.playing === false) {
                main.states.playing = true;
                playbtn.src = '../assets/play-green.svg';
                playbtn.style.rotate = '0deg';
                vis_play();
                complile_play();
            } else {
                main.states.playing = false;
                playbtn.src = '../assets/play.svg';
                playbtn.style.rotate = '90deg';
                stopPlay();
            }
        }
    });
}

function getVisPlay() {
    const playcolmn = document.createElement('div');
    main.track_display.appendChild(playcolmn);
    playcolmn.style.position = 'absolute';
    playcolmn.style.width = '1px';
    playcolmn.style.height = '100%';
    playcolmn.style.top = '0px';
    playcolmn.style.backgroundColor = 'white';
    playcolmn.style.display = 'none';
    
    var playframe = 0;
    var playcolumnpx = 0;
    
    function vis_play() {
        if(main.states.playing === true) {
            setTimeout(() => {
                playcolmn.style.display = 'block';
                playcolmn.style.left = playcolumnpx + "px";
                playcolumnpx++;
                vis_play();
            }, 1000 * main.states.trackSplit);
        } else {
            playframe = 0;
            playcolumnpx = 0;
            playcolmn.style.left = playcolumnpx + "px";
            playcolmn.style.display = 'none';
        }
    }

    return vis_play;
}

function parsePlugins() {
    electron.getPlugins(3);
}

electron.recieve((d, pID) => {

    if(pID !== 3) return;

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
        electron.getPlugin(key, 4);
    });
}, "get_plugins");

electron.recieve((da, pID) => {
    if(pID !== 4) return;
    const script = document.createElement('script');
    script.type = "module";
    script.innerHTML = da;
    document.body.appendChild(script);
}, "get_plugin");

export default {
    calculateVolume,
    newProjectIinit,
    getEvents,
    getVisPlay,
    parsePlugins
}