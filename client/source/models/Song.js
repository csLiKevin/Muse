import {Album} from "./Album";

export class Song {
    constructor(songObject) {
        this.album = new Album(songObject.album);
        this.artist = songObject.artist;
        this.file = songObject.file;
        this.persistentId = songObject.persistentId;
        this.name = songObject.name;
    }
}
export default Song;
