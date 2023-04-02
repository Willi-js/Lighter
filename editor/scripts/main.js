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
    possibleColors: ['red', 'blue', 'aqua', 'limegreen'],
    track_settings_on_track: null,
    tracks_array: [],
    settingsOn: false,
    settings: null
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
            editor.style.width = 'calc(100% - 38px)'
        }
    });

    new library.Thumb();
    new library.Thumb('MIDI');
}



newProjectIinit();
