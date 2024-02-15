import main from "../main.js";

class ExplItem {
    constructor(name = "", path = "", color = "white", icon, type = "folder", parent) {
        this.name = name;
        this.path = path;
        this.color = color;

        this.index = main.sidebarContent.childElementCount;

        this.core = document.createElement('div');
        this.core.classList = 'explorer-item';
        this.core.style.color = color;

        if(icon != "none" && icon != undefined) {
            this.icon = `../icons/${icon}.svg`;

            this.iconEl = document.createElement('img');
            this.core.append(this.iconEl);
            this.iconEl.classList = 'explorer-item-icon';
            this.iconEl.src = this.icon;
            this.iconEl.style.fill = color;
            this.iconEl.style.stroke = color;
        }

        this.nameEl = document.createElement('p');
        this.nameEl.textContent = name;
        this.nameEl.classList = 'explorer-item-name';
        this.core.append(this.nameEl);

        this.main = document.createElement("div");
        this.main.append(this.core);

        if(!parent && this.type == "folder") main.sidebarContent.append(this.main);
        else if(!parent && this.type == "file") main.sidebarContent.append(this.core);
        else if(parent && this.type == "folder") parent.append(this.main);
        else if(parent && this.type == "file") parent.append(this.core);

        if(type == "folder") {
            this.core.addEventListener('click', () => {
                electron.readExplorer(this.path, this.color, this.index);
                electron.recieve((d) => {
                    console.log(d);
                }, "read_explorer");
            });
        }
    }
}

export default async function ExploreSurface() {
    electron.readExplorer();
    electron.recieve((d) => {
        var colors = Array.from(main.states.possibleColors);
        d.forEach((e) => {
            if(colors.length === 0) colors = Array.from(main.states.possibleColors);
            const index = Math.floor(Math.random() * colors.length);
            if(e.isMain) {
                new ExplItem(e.name, e.path, e.color ? e.color : colors[index], e.type, e.type);
    
                colors.splice(index, 1);
            } else {
                const newPar = document.createElement("div");

                newPar.classList.add("inserted-container");

                new ExplItem(e.name, e.path, e.color, e.type, e.type, newPar);

                const ref = main.sidebarContent.children[e.index];

                ref.insertAdjacentElement("afterend", newPar);

            }

            
        });

        if(d[0].isMain) {
            const children = main.sidebarContent.children;
            for(let i = 0; i < children.length; i++) {
                children[i].style.display = "none";
            }
        }
        
    }, "read_explorer");
}