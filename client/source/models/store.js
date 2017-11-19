import {observable, useStrict} from "mobx";

import {SongList} from "./SongList";


useStrict(true);

export const store = {
    data: {
        songList: new SongList()
    }
};
export default store;

if (process.env.NODE_ENV !== "production") {
    // Allow console access to the store during development.
    window.store = store;
}
