const states = {
    sidebar_extended: Boolean,
    track_count: Number,
    possibleColors: Array,
    track_settings_on_track: null,
    tracks_array: Array,
    settingsOn: Boolean,
    settings: null,
    track_menu: null,
    scrollEl: null,
    playing: Boolean,
    trackSplit: Number
}

export default {
    sidebar: Element || null,
    sidebar_extend: Element || null,
    thumb_container: Element || null,
    states: states,
    thumb_container_line: Element || null,
    track_display: Element || null,
    editor: Element || null,
    ExploreSurface: () => {},
    sidebarContent: Element || null
}