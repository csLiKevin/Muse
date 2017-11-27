import {action, observable} from "mobx";

import {formatTime} from "../utils/time";


export class AudioWrapper {
    @observable audio;
    @observable currentTime = "--:--";
    @observable duration = "--:--";
    @observable src;

    constructor(url) {
        this.src = url;
        this.audio = new Audio(url);
        this.audio.addEventListener("durationchange", () => {
            this.setDuration(this.audio.duration);
            this.setCurrentTime(0);
        });
        this.audio.addEventListener("timeupdate", () => {
            this.setCurrentTime(this.audio.currentTime);
        });
    }

    addEventListener(eventType, callback) {
        this.audio.addEventListener(eventType, callback);
    }

    pause() {
        this.audio.pause();
    }

    play() {
        this.audio.play();
    }

    @action
    setCurrentTime(time) {
        this.currentTime = formatTime(time);
    }

    @action
    setDuration(time) {
        this.duration = formatTime(time);
    }
}
export default AudioWrapper;
