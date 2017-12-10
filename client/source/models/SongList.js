import {action, computed, observable} from "mobx";

import {Song} from "./Song";
import {PAGE_SIZE} from "../utils/constants";
import {GraphqlClient} from "../utils/graphqlClient";


export class SongList {
    @observable isLoading = false;
    @observable page = 1;
    @observable songs = [];
    @observable totalSongs = 0;

    @action
    addSong(songObject) {
        this.songs.push(new Song(songObject));
    }

    @action
    disableLoading() {
        this.isLoading = false;
    }

    @action
    fetchSongs(page) {
        this.isLoading = true;
        this.songs = [];
        return GraphqlClient
            .post(
                `{
                    songCount,
                    songs(page:${page}, pageSize:${PAGE_SIZE}) {
                        album {
                            image,
                            name
                        },
                        artist,
                        file,
                        name,
                        persistentId
                    }
                }`
            )
            .then((json) => {
                const {data: {songCount, songs}} = json;
                this.page = parseInt(page);
                this.totalSongs = songCount;
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

    @computed
    get numPages() {
        return Math.ceil(this.totalSongs / PAGE_SIZE);
    }
}
export default SongList;
