import mainFile from "../main.js";
import library from "./library.js";

export default class ThumbSelect {
    constructor(thumb) {
        this.menu = document.createElement('div');
        thumb.object.append(this.menu);
        this.menu.classList = 'menu';
        this.menu.style.left = `${10}px`;
        this.menu.style.top = `${20}px`;

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

        this.color_button.addEventListener('click', () => {

            this.menu.remove();

            const newInputWindow = document.createElement('div');
            document.body.append(newInputWindow);
            newInputWindow.classList = 'new-input-window';

            const container = document.createElement('div');
            newInputWindow.append(container);
            container.classList = 'color-container';

            const color_buttons_container = document.createElement('div');
            container.append(color_buttons_container);
            color_buttons_container.classList = 'color-button-container';

            const close = document.createElement('img');
            container.append(close);
            close.src = '../assets/close.svg';
            close.classList = 'close-name-change';

            for(let i = 0;i<mainFile.states.possibleColors.length;i++) {
                const color_button = document.createElement('button');
                color_buttons_container.append(color_button);
                color_button.style.backgroundColor = mainFile.states.possibleColors[i];
                color_button.setAttribute('data-color', mainFile.states.possibleColors[i]);
                color_button.classList = 'color-button';

                color_button.addEventListener('click', () => {
                    thumb.object.style.backgroundColor = color_button.getAttribute('data-color');
                    thumb.background = color_button.getAttribute('data-color');
                    thumb.object.setAttribute('data-color', color_button.getAttribute('data-color'));

                    var childNodes = thumb.track.childNodes;
                    var childElements = Array.from(childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);

                    childElements.forEach(el => {
                        el.style.backgroundColor = color_button.getAttribute('data-color');
                    })

                    newInputWindow.remove();
                })
            }

            close.addEventListener('click', () => {
                newInputWindow.remove();
            });

        });

        this.createAudio.addEventListener('click', () => {
            this.menu.remove();

            new library.Thumb('audio', undefined, undefined, "new");
        });

        this.createMIDI.addEventListener('click', () => {
            this.menu.remove();

            new library.Thumb('MIDI', undefined, undefined, "new");
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
            input.maxLength = 14;
            input.placeholder = 'select a new track name';

            const text = document.createElement('p');
            container.append(text);
            text.textContent = 'max char 14';
            text.classList = 'name-note';

            const submit_button = document.createElement('button');
            container.append(submit_button);
            submit_button.textContent = 'submit';
            submit_button.classList = 'submit-name-button';

            const close = document.createElement('img');
            container.append(close);
            close.src = '../assets/close.svg';
            close.classList = 'close-name-change';

            close.addEventListener('click', () => {
                newInputWindow.remove();
            });

            submit_button.addEventListener('click', () => {
                if(input.value != '' && input.value.trim() != '') {
                    thumb.updateTitle(input.value);
                } else {
                    thumb.updateTitle(`${thumb.id} ${thumb.type}`);
                }
                
                try {
                    thumb.settings.updateTitle(thumb.name);
                } catch {}
                newInputWindow.remove();
            });

            input.addEventListener('keypress', event => {
                var key = event.key.toLocaleLowerCase();

                if(key === 'enter') {
                    if(input.value != '' && input.value.trim() != '') {
                        thumb.updateTitle(input.value);
                    } else {
                        thumb.updateTitle(`${thumb.id} ${thumb.type}`);
                    }
                    
                    try {
                        thumb.settings.updateTitle(thumb.name);
                    } catch {}
                    newInputWindow.remove();
                }
                
            })
        });

    }
}
