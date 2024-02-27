import main from "../main.js";
import elements from "./elements.js";

class ExplItem {
    constructor(name, color, type, path, index, isMain, parent = undefined) {
        this.wrapper = elements.create('div');
        this.wrapper.classList.add("explorer-item-wrapper");
        this.main = elements.create('div');

        this.main.classList.add("explorer-item");
        this.wrapper.append(this.main);

        this.name = name;
        this.color = color;
        this.type = type;
        this.path = path;
        this.index = index;
        this.isMain = isMain;

        if(this.isMain) {
            main.sidebarContent.append(this.wrapper);
        } else {
            if(this.type !== "folder") {
                main.sidebarContent.children[index].append(this.wrapper);
                this.wrapper.classList.add("secondary-wrapper");
            }
        }

        if(this.index === undefined) {
            this.index = main.sidebarContent.children.length - 1;
        }

        if(this.type === "file") {
            this.wrapper.style.display = "none";
        }

        if(this.type === "folder") {
            this.wrapper.setAttribute("open", false);
            this.wrapper.style.cursor = "pointer";

            electron.readExplorer(this.path, this.color, this.index);

            this.wrapper.addEventListener("click", (e) => {
                if(this.wrapper.getAttribute("open") === "true") {
                    this.wrapper.setAttribute("open", false);
                    this.wrapper.childNodes.forEach(el => {
                        if(el.classList.contains("secondary-wrapper")) {
                            el.style.display = "none";
                        }
                    });
                } else {
                    this.wrapper.setAttribute("open", true);
                    this.wrapper.childNodes.forEach(el => {
                        if(el.classList.contains("secondary-wrapper")) {
                            el.style.display = "flex";
                        }
                    });
                }
            });
        }

        this.icon = elements.create('div');
        this.icon.classList=`${this.type} explorer-item-icon`;
        this.main.append(this.icon);

        this.nameEl = elements.create('p');
        this.nameEl.textContent = name;
        this.nameEl.style.color = color;
        this.main.append(this.nameEl);
    }
}

export default async function ExploreSurface() {

    var colors = Array.from(main.states.possibleColors);

    function chooseColor() {
        var color;
    
        if(colors.length === 0) colors = Array.from(main.states.possibleColors);
        color = colors[Math.floor(Math.random()*colors.length)];
        colors.splice(colors.indexOf(color), 1);
        return color;
    }

    electron.readExplorer(undefined, undefined, undefined);
    electron.recieve((a) => {
        a.forEach(el => {
            if(el.isMain) {
                new ExplItem(el.name, chooseColor(), el.type, el.path, el.index, el.isMain);
            } else {
                new ExplItem(el.name, el.color, el.type, el.path, el.index, el.isMain);
            }
        });

        main.sidebarContent.childNodes.forEach(e => {
            e.style.display = "none";
        });
    }, "read_explorer");
   
}