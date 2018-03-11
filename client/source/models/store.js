import {useStrict} from "mobx";

import {Player} from "./Player";
import {Songs} from "./Songs";


useStrict(true);

export const store = {
    player: new Player(),
    songs: new Songs()
};
export default store;
