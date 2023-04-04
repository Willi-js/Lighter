import mainFile from "../main.js";
import library from "./library.js";

export default class ThumbSelect {
    constructor(thumb, mX, mY, settings) {
        this.menu = document.createElement('div');
        document.body.append(this.menu);
        this.menu.classList = 'menu';
        this.menu.style.left = `${mX}px`;
        this.menu.style.top = `${mY}px`;

        this.name_button = document.createElement('button');
        this.menu.append(this.name_button);
        this.name_button.classList = 'button';
        this.name_button.textContent = 'change name';

        this.color_button = document.createElement('button');
        this.menu.append(this.color_button);
        this.color_button.classList = 'button';
        this.color_button.textContent = 'change color';

        this.remove_button = document.createElement('button');
        this.menu.append(this.remove_button);
        this.remove_button.classList = 'button';
        this.remove_button.textContent = 'remove track';

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
                if(e.target != this.menu && e.target != this.name_button && e.target != this.color_button && e.target != this.remove_button && e.target != this.createAudio && e.target != this.createMIDI) {
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
        });

        this.remove_button.addEventListener('click', e => {
            this.menu.remove();
            thumb.remove();
        })
        
        this.name_button.addEventListener('click', e => {

            this.menu.remove();

            const newInputWindow = document.createElement('div');
            document.body.append(newInputWindow);
            newInputWindow.classList = 'new-input-window';

            const container = document.createElement('div');
            newInputWindow.append(container);
            container.classList = 'name-container';

            const input = document.createElement('input');
            container.append(input);
            input.value = thumb.name;
            input.classList = 'input-name';
            input.maxLength = 11;
            input.placeholder = 'select a new track name';

            const text = document.createElement('p');
            container.append(text);
            text.textContent = 'max char 11';
            text.classList = 'name-note';

            const submit_button = document.createElement('button');
            container.append(submit_button);
            submit_button.textContent = 'submit';
            submit_button.classList = 'submit-name-button';

            const close = document.createElement('img');
            container.append(close);
            close.src = '../assests/close.svg';
            close.classList = 'close-name-change';

            close.addEventListener('click', () => {
                newInputWindow.remove();
            });

            submit_button.addEventListener('click', () => {
                thumb.updateTitle(input.value);
                try {
                    settings.updateTitle(input.value);
                } catch {}
                newInputWindow.remove();
            });

            input.addEventListener('keypress', event => {
                var key = event.key.toLocaleLowerCase();

                if(key === 'enter') {
                    thumb.updateTitle(input.value);
                    try {
                        settings.updateTitle(input.value);
                    } catch {}
                    newInputWindow.remove();
                }
                
            })
        });

    }
}
