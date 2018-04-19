import {action, computed, observable} from "mobx";
import queryString from "query-string";

import {Album} from "./Album";
import {ApiClient} from "../utils/apiClient";


export class Albums {
    @observable filters;
    @observable loading;

    constructor() {
        this._lockLoading = false;
        this.cache = {};
        this.count = 0;
        this.filters = {};
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
    getAlbums(filters={}) {
        const queryParameters = queryString.stringify(filters);
        const cachedSongs = this.cache[queryParameters];

        if (cachedSongs) {
            return Promise.resolve(cachedSongs);
        }

        this.enableLoading();
        return ApiClient.getAlbums(filters).then(action(json => {
            const {count, results} = json;
            this.cache[queryParameters] = results.map(result => new Album(result));
            this.count = count;
            this.filters = filters;
            this.disableLoading();
            return results;
        }));
    }

    @action
    getAllAlbums() {
        this.enableLoading();
        this._lockLoading = true;
        return this.getAlbums().then((firstPage) => {
            const pageSize = firstPage.length;
            const numPages = Math.ceil(this.count / pageSize);
            const promises = [Promise.resolve(firstPage)];
            for (let page = 2; page <= numPages; page++) {
                promises.push(this.getAlbums({page}));
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
        return this.cache[queryString.stringify(this.filters)] || [];
    }
}
export default Albums;
