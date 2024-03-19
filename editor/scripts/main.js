const sidebar_extend = document.querySelector('.arrow-extend');
const sidebar = document.querySelector('.sidebar');
const thumb_container = document.querySelector('.track-thumb-container');
const thumb_container_line = document.querySelector('.track-thumb-container-line');
const track_display = document.querySelector('.track-display');
const editor = document.querySelector('.editor');
const sidebarContent = document.querySelector('.sidebar-container');

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
    editor: editor,
    ExploreSurface: ExploreSurface,
    sidebarContent: sidebarContent
}

export default exports;

import ExploreSurface from "./library/FileExplorer.js";
import utilitys from "./library/utilitys.js";

utilitys.newProjectIinit();
utilitys.getEvents();
utilitys.parsePlugins();

await ExploreSurface();