export function formatTime(time) {
    time = Math.trunc(time);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${("00" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}`;
}
