import {configure} from "mobx";

import {Albums} from "./Albums";
import {Player} from "./Player";
import {Songs} from "./Songs";


configure({enforceActions: true});

export const store = {
    albums: new Albums(),
    player: new Player(),
    songs: new Songs()
};
export default store;
