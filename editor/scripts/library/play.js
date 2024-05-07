import main from "../main.js";

const ID = 8;

export function complile_play() {
    electron.get("config", ID);
}

const playingNodes = new Map();
let audioContext = undefined;

electron.recieve((d, pID)=> {
    if(pID !== ID) return;

    audioContext = new AudioContext();

    var current = 0;

    var inter = setInterval(() => {
        if(main.states.playing) {
          
            const data = JSON.parse(d);
            const tracks = data.tracks;;

            tracks.forEach((e) => {
                const samples = e.samples;

                samples.forEach((s) => {
                    
                    if(s.place === current) {
                        electron.processFile(s.sample, 10);
                    }; 
                });
            });

            current += 1000 * main.states.trackSplit;
            
        } else {
            clearInterval(inter);
        }
    }, 1000 * main.states.trackSplit);
}, "get");

electron.recieve((d, pID) => {
    if(pID !== 10) return;

    const buffer = JSON.parse(d);

    const bufferarr = new Uint8Array(buffer.data).buffer;

    audioContext.decodeAudioData(bufferarr).then((audioBuffer) => {
       const source = audioContext.createBufferSource();
       source.buffer = audioBuffer;
       source.connect(audioContext.destination);
       source.start();
       const cID = Date.now().toString();
       playingNodes.set(cID, source);
    });

}, "process_file");

export function stopPlay() {
    playingNodes.forEach((n, i) => {
        n.stop()
        playingNodes.delete(i);
    });
    audioContext.close();
}