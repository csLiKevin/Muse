import {action, observable} from "mobx";

import {Song} from "./Song";


export class SongList {
    @observable isLoading = false;
    @observable songs = [];

    @action
    addSong(songObject) {
        this.songs.push(new Song(songObject));
    }

    @action
    fetchSongs() {
        this.isLoading = true;
        this.songs = [];
        // TODO: Replace with real code.
        setTimeout(action(() => {
            this.addSong({persistentId: 1, name: "first"});
            this.addSong({persistentId: 2, name: "second"});
            this.isLoading = false;
        }), 5000);
    }
}
export default SongList;
