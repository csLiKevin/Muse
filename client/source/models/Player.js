import {action, computed, observable} from "mobx";

import {AudioWrapper} from "./AudioWrapper";
import {Song} from "./Song";


export class Player {
    @observable audio = new AudioWrapper();
    @observable current = new Song();
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
        if (this.current.playable) {
            this.history.push(this.current);
        }
        this.current = this.queue.shift();
        this.playSong();
    }

    @action
    playPreviousSong() {
        if (this.current.playable) {
            this.queue.unshift(this.current);
        }
        this.current = this.history.pop();
        this.playSong();
    }

    @action
    playSong(song) {
        if (song) {
            // To play a specific song place the current song on top of the queue.
            this.history.push(song);
            this.playPreviousSong();
            return;
        } else if (!this.current.playable) {
            this.current = this.queue.shift();
        }
        if (this.current.playable) {
            // A new audio object should be created if the audio source has changed.
            if (this.audio.src !== this.current.file) {
                this.audio.pause();
                this.audio = new AudioWrapper(this.current.file);
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
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        const shuffledSongs = songs.slice();
        shuffleArray(shuffledSongs);
        this.queue.push(...shuffledSongs);
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
