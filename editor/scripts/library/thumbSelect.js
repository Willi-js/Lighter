import mainFile from "../main.js";

export default class ThumbSelect {
    constructor(thumb, mX, mY) {
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

        setTimeout(() => {
            document.addEventListener('mousedown', e => {
                if(e.target != this.menu && e.target != this.name_button && e.target != this.color_button && e.target != this.remove_button) {
                    this.menu.remove();
                }
            });
        }, 100) 
        
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
            input.maxLength = 12;
            input.placeholder = 'select a new track name';

            const text = document.createElement('p');
            container.append(text);
            text.textContent = 'max char 12';
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
                newInputWindow.remove();
            });

            input.addEventListener('keypress', event => {
                var key = event.key.toLocaleLowerCase();

                if(key === 'enter') {
                    thumb.updateTitle(input.value);
                    newInputWindow.remove();
                }
                
            })
        });

    }
}
