import {Button} from "material-ui";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";
import {Player} from "./Player";
import {History} from "./History";
import {Queue} from "./Queue";
import {shuffleArray} from "../utils/functions";


@inject(({player, songs}) => ({player, songs}))
@observer
export class Client extends Component {
    render() {
        return (
            <div>
                <Player />
                <Button
                    color="primary"
                    onClick={() => {
                        this.props.player.clearQueue();
                        this.props.songs.getAllSongs().then((songs) => {
                            shuffleArray(songs);
                            this.props.player.queueSongs(songs);
                        });
                    }}
                    variant="raised"
                >
                    {
                        !this.props.songs.loading
                            ? "Queue All Songs"
                            : <LoadingAnimation color="inherit" size={24}/>
                    }
                </Button>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}><History /></div>
                    <div style={{flex: 1}}><Queue/></div>
                </div>
            </div>
        );
    }
}
export default Client;