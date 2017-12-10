import {computed, observable} from "mobx";

import {Album} from "./Album";

export class Song {
    @observable file;

    constructor(songObject) {
        if (!songObject) {
            songObject = {
                album: {}
            };
        }

        this.album = new Album(songObject.album);
        this.artist = songObject.artist;
        this.file = songObject.file;
        this.persistentId = songObject.persistentId;
        this.name = songObject.name;
    }

    @computed
    get playable() {
        return Boolean(this.file);
    }
}
export default Song;
