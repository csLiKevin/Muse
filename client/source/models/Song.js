export class Song {
    constructor(songObject) {
        this.persistentId = songObject.persistentId;
        this.name = songObject.name;
    }
}
export default Song;