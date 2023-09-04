export default class Visualiser {
    constructor(parent, color, type = "audio") {
        this.el = document.createElement("canvas");
        this.parent = parent;
        this.type = type;

        this.height = this.parent.clientHeight;
        this.width = 1;

        this.el.width = this.width;
        this.el.height = this.parent.clientHeight;

        this.el.style.width = this.el.width + 'px';
        this.el.style.height = this.parent.clientHeight + "px";

        this.el.style.backgroundColor = color;
        this.el.style.borderRadius = '5px';
        parent.append(this.el);

        this.current = 0

        this.ctx = this.el.getContext("2d");
    }
    drawLine(volumes) {
        if(volumes.length > this.width) {
            this.width = volumes.length;
            this.el.width = this.width;
            this.el.style.width = this.el.width + "px";
        }

        volumes.forEach( el => {
            var half = el / 2;
            this.ctx.fillRect(this.current, this.height / 2 - half, 1, el === 0 ? 1 : el);
            this.current++;
        });

    }

    drawLineLive(volume) {

        if(this.current + 1 > this.width) {

            const saver = document.createElement("canvas");
            saver.width = this.width;
            saver.height = this.height;
            const saverctx = saver.getContext("2d");
            saverctx.drawImage(this.el, 0, 0);

            this.width = this.current + 1;
            this.el.width = this.width;
            this.el.style.width = this.width + "px";

            this.ctx.drawImage(saver, 0, 0);
        }

        var half = volume / 2;
        this.ctx.fillRect(this.current, this.height / 2 - half, 1, volume === 0 ? 1 : volume);
        this.current++;

    }
}