export function formatTime(time) {
    if (isNaN(time)) {
        return "--:--";
    }
    time = Math.trunc(time);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${("00" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}`;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default {
    formatTime,
    shuffleArray
};
