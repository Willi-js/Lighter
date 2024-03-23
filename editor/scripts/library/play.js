const ID = Math.floor(Math.random() * 9999) + 0.2;

export function complile_play() {
    electron.get("config", ID);
}

electron.recieve((d, pID)=> {
    if(pID !== ID) return;
    console.log(d);
}, "get");