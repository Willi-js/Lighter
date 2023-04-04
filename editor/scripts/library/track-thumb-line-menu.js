import mainFile from "../main.js";
import library from "./library.js";

export default class TrackThumbMenu {
    constructor (x, y) {
        this.menu = document.createElement('div');
        document.body.append(this.menu);
        this.menu.classList = 'track-thumb-menu';
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;

        this.createAudio = document.createElement('button');
        this.menu.append(this.createAudio);
        this.createAudio.classList = 'button';
        this.createAudio.textContent = 'insert audio';

        this.createMIDI = document.createElement('button');
        this.menu.append(this.createMIDI);
        this.createMIDI.classList = 'button';
        this.createMIDI.textContent = 'insert MIDI';

        setTimeout(() => {
            document.addEventListener('mousedown', e => {
                if(e.target != this.menu && e.target != this.createAudio && e.target != this.createMIDI) {
                    this.menu.remove();
                }
            });
        }, 100);

        this.createAudio.addEventListener('click', () => {
            this.menu.remove();

            new library.Thumb('audio');
        });

        this.createMIDI.addEventListener('click', () => {
            this.menu.remove();

            new library.Thumb('MIDI');
        })
    }
}
