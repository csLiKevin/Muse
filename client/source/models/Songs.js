import {action, observable} from "mobx";
import queryString from "query-string";

import {Song} from "../models/Song";
import {ApiClient} from "../utils/apiClient";


export class Songs {
    @observable loading;

    constructor() {
        this._lockLoading = false;
        this.cache = {};
        this.count = 0;
        this.loading = false;
    }

    @action
    disableLoading() {
        if (!this._lockLoading) {
            this.loading = false;
        }
    }

    @action
    enableLoading() {
        if (!this._lockLoading) {
            this.loading = true;
        }
    }

    @action
    getSongs(filters={page: 1}) {
        const queryParameters = queryString.stringify(filters);
        const cachedSongs = this.cache[queryParameters];

        if (cachedSongs) {
            return Promise.resolve(cachedSongs);
        }

        this.enableLoading();
        return ApiClient.getSongs(filters).then(action(json => {
            const {count, results} = json;
            this.cache[queryParameters] = results.map(result => new Song(result));
            this.count = count;
            this.disableLoading();
            return results;
        }));
    }
}
export default Songs;
