import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


@inject((store) => {
    return {
        songList: store.data.songList
    };
})
@observer
export class SongList extends Component {
    static get propTypes() {
        return {
            songList: PropTypes.object.isRequired
        };
    }

    componentWillMount() {
        this.props.songList.fetchSongs();
    }

    render() {
        if (this.props.songList.isLoading) {
            return <LoadingAnimation/>;
        }
        return (
            <div>
                {
                    this.props.songList.songs.map((value) => {
                        return value.name;
                    })
                }
            </div>
        );
    }
}
export default SongList;
