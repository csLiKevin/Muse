import camelcase from "lodash.camelcase";
import snakecase from "lodash.snakecase";
import {matchPath} from "react-router-dom";

import {ROUTES} from "./constants";


let _idCounter = 0;

export function findRoute(pathname) {
    return Object.values(ROUTES).find(route => matchPath(pathname, route));
}

export function formatTime(time) {
    if (isNaN(time)) {
        return "--:--";
    }
    time = Math.trunc(time);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${("00" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}`;
}

export function generateId(prefix="") {
    return `${prefix}${_idCounter++}`;
}

export function hexToRgba(hex, opacity) {
    if (hex.startsWith("#")) {
        hex = hex.substring(1);

        // Convert shorthand to longhand.
        if (hex.length === 3) {
            const [hex1, hex2, hex3] = hex;
            hex = `${hex1}${hex1}${hex2}${hex2}${hex3}${hex3}`;
        }
    }

    const decimal = parseInt(hex, 16);
    const red = (decimal >> 16) & 255;
    const green = (decimal >> 8) & 255;
    const blue = decimal & 255;
    return `rgba(${red}, ${green}, ${blue}, ${opacity / 100.0})`;
}

export function pythonize(object, reverse=false) {
    const keyTransformationFunction = reverse ? camelcase : snakecase;

    return Object.entries(object).reduce((accumulator, [key, value]) => {
        if (Array.isArray(value)) {
            value = value.map(part => pythonize(part, reverse));
        } else if (value && typeof value === "object") {
            value = pythonize(value, reverse);
        }

        accumulator[keyTransformationFunction(key)] = value;
        return accumulator;
    }, {});
}

export function reversePath(path, parameters) {
    return Object.entries(parameters).reduce(
        (accumulator, [key, value]) => accumulator.replace(`:${key}`, value),
        path
    );
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default {
    findRoute,
    formatTime,
    generateId,
    hexToRgba,
    pythonize,
    reversePath,
    shuffleArray
};
