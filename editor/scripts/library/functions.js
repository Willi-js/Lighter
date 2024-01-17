import mainfile from "../main.js";

function calculatePlace(t) {
    const worth = mainfile.states.trackSplit * 1000;
    return (t / worth).toFixed(2);
}

function turnIntoArray(file) {
    
}

export default {
    calculatePlace: calculatePlace
}