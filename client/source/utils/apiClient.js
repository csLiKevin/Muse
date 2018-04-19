import queryString from "query-string";

import {pythonize} from "../utils/functions";


export class ApiClient {
    static get(endpoint, parameters) {
        return fetch(`${endpoint}?${queryString.stringify(pythonize(parameters))}`)
            .then(response => response.json())
            .then(json => pythonize(json, true));
    }

    static getAlbums({page=1, pageSize=24, ...filters}) {
        return ApiClient.get('/api/albums/', {page, page_size: pageSize, ...filters});
    }

    static getSongs({page=1, pageSize=24, ...filters}) {
        return ApiClient.get('/api/songs/', {page, page_size: pageSize, ...filters});
    }
}
