import main from "../main.js";

const ID = Math.floor(Math.random() * 9999) + 0.2;

export function complile_play() {
    electron.get("config", ID);
}

electron.recieve((d, pID)=> {
    if(pID !== ID) return;

    var current = 0;

    var inter = setInterval(() => {
        if(main.states.playing) {
            
            const data = JSON.parse(d);
            const tracks = data.tracks;;

            tracks.forEach((e) => {
                const samples = e.samples;

                samples.forEach((s) => {
                    if(s.place === current) {
                        electron.processFile(s.sample);
                    }; 
                });
            });

            current += 1000 * main.states.trackSplit;
            
        } else {
            clearInterval(inter);
        }
    }, 1000 * main.states.trackSplit);
}, "get");