const fs = require("fs");
const path = require("path");

module.exports = (states) => {
    const plugins = fs.readdirSync(states.plugins);
    for (let i = 0; i < plugins.length; i++) {
        let currentElement = plugins[i];
      
        if (currentElement === "config.json" || currentElement === "lib" || currentElement.startsWith("--ignore-")) {
          plugins.splice(i, 1);
          i--;
        } else {
          currentElement = currentElement.replace(".js", "");
      
          currentElement = currentElement.replace(/([A-Z])/g, ' $1');
      
          plugins[i] = [currentElement.trim(), plugins[i]];
        }
    }

    const list = {};
    const plugin = {};
    var config;
    try {
        config = JSON.parse(fs.readFileSync(states.plugins+'/config.json'));
    } catch {
        config = {};
    }
    

    plugins.forEach(el => {
        list[el[0]] = el[1];
        if(config.plugins[el[0]] === undefined) {
            plugin[el[0]] = false;
        } else {
            plugin[el[0]] = config.plugins[el[0]];
        }
    });

    const keys = Object.keys(config.plugins);

    keys.forEach(el => {
        val = config.plugins[el];

        if(!Object.keys(list).includes(el)) {
            delete config.plugins[el];
        }
    });

    const newC = {
        list,
        plugins: plugin
    }
    
    config = newC;

    fs.writeFileSync(states.plugins+'/config.json', JSON.stringify(config, null, 2));

}