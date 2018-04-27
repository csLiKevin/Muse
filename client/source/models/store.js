import {configure} from "mobx";

import {Player} from "./Player";
import {Songs} from "./Songs";


configure({enforceActions: true});

export const store = {
    player: new Player(),
    songs: new Songs()
};
export default store;
