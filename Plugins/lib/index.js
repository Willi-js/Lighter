const states = {
    sidebar_extended: false,
    track_count: 0,
    possibleColors: [],
    track_settings_on_track: null,
    tracks_array: [],
    settingsOn: false,
    settings: null,
    track_menu: null,
    scrollEl: null,
    playing: false,
    trackSplit: 0
}

export default {
    sidebar: Element || null,
    sidebar_extend: Element || null,
    thumb_container: Element || null,
    states: states,
    thumb_container_line: Element || null,
    track_display: Element || null,
    editor: Element || null
}