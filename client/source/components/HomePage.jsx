import {Button} from "material-ui";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


@inject(({player, songs}) => ({player, songs}))
@observer
export class HomePage extends Component {
    queueRandomSong() {
        return this.props.songs.getSongs({pageSize: 1})
            .then(() => {
                const randomNumber = Math.floor(Math.random() * this.props.songs.count) + 1;
                return this.props.songs.getSongs({page: randomNumber, pageSize: 1});
            })
            .then((songs) => {
                const song = songs[0];
                this.props.player.queueSong(song);
            });
    }

    render() {
        return (
            <Button
                color="primary"
                onClick={() => {
                    this.props.player.clearQueue();
                    this.props.songs.getSongs({pageSize: 1})
                        .then(() => {
                            this.props.player.callbacks.ended = () => {
                                this.queueRandomSong().then(() => {
                                    this.props.player.playNextSong();
                                });
                            };
                            this.props.player.callbacks.canPlay = () => {
                                if (!this.props.player.hasQueue) {
                                    this.queueRandomSong();
                                }
                            };
                            this.props.player.callbacks.ended();
                        });
                }}
                variant="raised"
            >
                {
                    !this.props.songs.loading
                        ? "Play Random Song"
                        : <LoadingAnimation color="inherit" size={24}/>
                }
            </Button>
        );
    }
}
export default HomePage;
