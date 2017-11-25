export class Song {
    constructor(songObject) {
        this.file = songObject.file;
        this.persistentId = songObject.persistentId;
        this.name = songObject.name;
    }
}
export default Song;
