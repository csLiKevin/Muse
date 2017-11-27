import {action, computed, observable} from "mobx";

import {AudioWrapper} from "./AudioWrapper";


export class Player {
    @observable _current;
    @observable audio = new AudioWrapper();
    @observable history = [];
    @observable isPlaying = false;
    @observable queue = [];

    @action
    pauseSong() {
        this.audio.pause();
        this.isPlaying = false;
    }

    @action
    playNextSong() {
        if (this._current) {
            this.history.push(this._current);
        }
        this._current = this.queue.shift();
        this.playSong();
    }

    @action
    playPreviousSong() {
        if (this._current) {
            this.queue.push(this._current);
        }
        this._current = this.history.pop();
        this.playSong();
    }

    @action
    playSong(song) {
        if (song) {
            // To play a specific song place the current song on top of the queue.
            if (this._current) {
                this.queue.unshift(this._current);
            }
            this._current = song;
        } else if (!this._current) {
            this._current = this.queue.shift();
        }
        if (this._current) {
            // A new audio object should not be created if the audio source has not changed.
            if (this.audio.src !== this._current.file) {
                this.audio.pause();
                this.audio = new AudioWrapper(this._current.file);
                this.audio.addEventListener("ended", () => {
                    this.playNextSong();
                });
            }
            this.audio.play();
            this.isPlaying = true;
        } else {
            // Pause the player if there is no song to play.
            this.pauseSong();
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
        if (!this._current) {
            return {
                album: {}
            };
        }
        return this._current;
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
