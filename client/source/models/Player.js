import {action, computed, observable} from "mobx";


export class Player {
    @observable _currentSong;
    @observable _audioStatus;
    @observable history;
    @observable queue;

    constructor() {
        this._audioStatus = {
            currentTime: NaN,
            duration: NaN,
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
            this._audioStatus.duration = this.audio.duration;
        }));
        this.audio.addEventListener("ended", () => {
            this.playNextSong();
        });
        this.audio.addEventListener("pause", action(() => {
            this._audioStatus.playing = false;
        }));
        this.audio.addEventListener("playing", action(() => {
            this._audioStatus.playing = true;
        }));
        this.audio.addEventListener("loadstart", action(() => {
            this._audioStatus.loading = true;
        }));
        this.audio.addEventListener("timeupdate", action(() => {
            this._audioStatus.currentTime = this.audio.currentTime;
        }));

        this.audio.addEventListener("error", action(() => {
            // TODO: Temporary fix for "PIPELINE_ERROR_DECODE: Failed to send audio packet for decoding".
            const { currentTime, duration, src, error } = this.audio;
            console.log("*** ERROR ***", {currentTime, duration, src, error});
            this.playNextSong();
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