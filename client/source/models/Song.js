import {Album} from "./Album";


export class Song {
    constructor({album, artist, file, name, persistentId}) {
        this.album = new Album(album);
        this.artist = artist;
        this.file = file;
        this.name = name;
        this.persistentId = persistentId;
    }
}
export default Song;
