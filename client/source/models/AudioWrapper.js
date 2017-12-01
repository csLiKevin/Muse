import {action, computed, observable} from "mobx";

import {formatTime} from "../utils/time";


export class AudioWrapper {
    @observable audio;
    @observable currentTime;
    @observable duration;
    @observable isLoading;
    @observable src;

    constructor(url) {
        this.src = url;
        this.audio = new Audio(url);
        this.isLoading = false;
        this.audio.addEventListener("canplay", () => {
            this.disableLoading();
        });
        this.audio.addEventListener("durationchange", () => {
            this.setDuration(this.audio.duration);
            this.setCurrentTime(0);
        });
        this.audio.addEventListener("loadstart", () => {
            this.enableLoading();
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
    disableLoading() {
        this.isLoading = false;
    }

    @action
    enableLoading() {
        this.isLoading = true;
    }

    @action
    setCurrentTime(time) {
        this.currentTime = time;
    }

    @action
    setDuration(time) {
        this.duration = time;
    }

    @computed
    get formattedCurrentTime() {
        return formatTime(this.currentTime);
    }

    @computed
    get formattedDuration() {
        return formatTime(this.duration);
    }
}
export default AudioWrapper;
