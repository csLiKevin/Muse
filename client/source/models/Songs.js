import {action, computed, observable} from "mobx";
import queryString from "query-string";

import {ApiClient} from "../utils/apiClient";


export class Songs {
    @observable _lockLoading = false;
    @observable cache = {};
    @observable count = 0;
    @observable filters = {};
    @observable loading = false;

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
    getSongs(filters={}) {
        const queryParameters = queryString.stringify(filters);

        if (this.cache[queryParameters]) {
            return Promise.resolve(this.cache[queryParameters]);
        }

        this.enableLoading();
        return ApiClient.getSongs(filters).then(json => {
            const {count, results} = json;
            this.cache[queryParameters] = results;
            this.count = count;
            this.filters = filters;
            this.disableLoading();
            return results;
        });
    }

    @action
    getAllSongs() {
        this.enableLoading();
        this._lockLoading = true;
        return this.getSongs().then((firstPage) => {
            const pageSize = firstPage.length;
            const numPages = Math.ceil(this.count / pageSize);
            const promises = [Promise.resolve(firstPage)];
            for (let page = 2; page <= numPages; page++) {
                promises.push(this.getSongs({page}));
            }
            return Promise.all(promises).then((results) => {
                results = [].concat(...results);
                this._lockLoading = false;
                this.disableLoading();
                return results;
            });
        });
    }

    @computed
    get inView() {
        return this.cache[queryString.stringify(this.filters)];
    }
}
export default Songs;