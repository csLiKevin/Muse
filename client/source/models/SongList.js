import {action, computed, observable} from "mobx";

import {Song} from "./Song";
import {GraphqlClient} from "../utils/graphqlClient";


export class SongList {
    @observable isLoading = false;
    @observable songs = [];

    @action
    addSong(songObject) {
        this.songs.push(new Song(songObject));
    }

    @action
    disableLoading() {
        this.isLoading = false;
    }

    @action
    fetchSongs() {
        this.isLoading = true;
        this.songs = [];
        return GraphqlClient.post("{songs{album{image, name}, artist, file, name, persistentId}}").then((json) => {
            const {data: {songs}} = json;
            songs.forEach((songObject) => {
                this.addSong(songObject)
            });
            this.disableLoading();
        });
    }

    @computed
    get hasSongs() {
        return Boolean(this.songs.length);
    }
}
export default SongList;
