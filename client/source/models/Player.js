import {action, computed, observable} from "mobx";
import {formatTime} from "../utils/functions";


export class Player {
    @observable _currentSong;
    @observable _audioStatus;
    @observable history;
    @observable queue;

    constructor() {
        this._audioStatus = {
            currentTime: formatTime(undefined),
            duration: formatTime(undefined),
            loading: false,
            playing: false
        };
        this._currentSong = undefined;
        this.audio = new Audio();
        this.history = [];
        this.loading = false;
        this.queue = [];

        this.audio.addEventListener("canplay", action(() => {
            this._audioStatus.loading = false;
        }));
        this.audio.addEventListener("durationchange", action(() => {
            this._audioStatus.duration = formatTime(this.audio.duration);
        }));
        this.audio.addEventListener("ended", () => {
            this.playNextSong();
        });
        this.audio.addEventListener("pause", action(() => {
            this._audioStatus.playing = false;
        }));
        this.audio.addEventListener("play", action(() => {
            this._audioStatus.playing = true;
        }));
        this.audio.addEventListener("loadstart", action(() => {
            this._audioStatus.loading = true;
        }));
        this.audio.addEventListener("timeupdate", action(() => {
            this._audioStatus.currentTime = formatTime(this.audio.currentTime);
        }));
    }

    @action
    clearQueue() {
        this.queue = [];
    }

    pauseSong() {
        this.audio.pause();
    }

    @action
    playNextSong() {
        if (this._currentSong) {
            this.history.push(this._currentSong);
        }

        if (this.hasQueue) {
            this._currentSong = this.queue.shift();
            this.audio.src = this._currentSong.file;
            this.playSong();
        } else {
            this._currentSong = undefined;
        }
    }

    @action
    playPreviousSong() {
        if (this._currentSong) {
            this.queue.unshift(this._currentSong)
        }

        if (this.hasHistory) {
            this._currentSong = this.history.pop();
            this.audio.src = this._currentSong.file;
            this.playSong();
        } else {
            this._currentSong = undefined;
        }
    }

    playSong() {
        if (this._currentSong) {
            this.audio.play();
        } else {
            this.playNextSong();
        }
    }

    @action
    queueSong(song) {
        this.queue.push(song);
    }

    @action
    queueSongs(songs) {
        this.queue.push(...songs);
    }

    @computed
    get currentSong() {
        return this._currentSong
            ? {...this._currentSong, audioStatus: this._audioStatus}
            : { album: {}, audioStatus: this._audioStatus };
    }

    @computed
    get hasHistory() {
        return Boolean(this.history.length);
    }

    @computed
    get hasQueue() {
        return Boolean(this.queue.length);
    }
}
export default Player;