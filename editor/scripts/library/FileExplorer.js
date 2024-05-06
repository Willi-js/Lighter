import main from "../main.js";
import elements from "./elements.js";

class ExplItem {
    constructor(name, color, type, path, index, isMain) {
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
        this.arrow = elements.create('img');
        
        this.arrow.setAttribute("src", "../assets/arrow-two.svg");
        this.arrow.style.width = "10px";
        this.arrow.style.rotate = "90deg";
        this.arrow.style.transitionDuration = ".1s";

        this.icon = elements.create('div');
        this.icon.classList=`${this.type} explorer-item-icon`;
        this.main.append(this.icon);

        this.nameEl = elements.create('p');
        this.nameEl.textContent = name;
        this.nameEl.style.color = color;
        this.main.append(this.nameEl);

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

            this.main.append(this.arrow);

            this.wrapper.setAttribute("open", false);
            this.main.style.cursor = "pointer";

            electron.readExplorer(this.path, this.color, this.index, 9);

            this.main.addEventListener("click", (e) => {
                if(this.wrapper.getAttribute("open") === "true") {
                    this.wrapper.setAttribute("open", false);
                    this.arrow.style.rotate = "90deg";
                    this.wrapper.childNodes.forEach(el => {
                        if(el.classList.contains("secondary-wrapper")) {
                            el.style.display = "none";
                        }
                    });
                } else {
                    this.wrapper.setAttribute("open", true);
                    this.arrow.style.rotate = "180deg";
                    this.wrapper.childNodes.forEach(el => {
                        if(el.classList.contains("secondary-wrapper")) {
                            el.style.display = "flex";
                        }
                    });
                }
            });
        }
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

    electron.readExplorer(undefined, undefined, undefined, 9);
    electron.recieve((a, pID) => {
        if(pID !== 9) return;
        a.forEach(el => {
            if(el.isMain) {
                new ExplItem(el.name, chooseColor(), el.type, el.path, el.index, el.isMain);
            } else {
                if(el.name === "linker.link") {

                }
                new ExplItem(el.name, el.color, el.type, el.path, el.index, el.isMain);
            }
        });

        main.sidebarContent.childNodes.forEach(e => {
            e.style.display = "none";
        });
    }, "read_explorer");
   
}