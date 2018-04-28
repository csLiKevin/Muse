import queryString from "query-string";
import urlJoin from "url-join";

import {pythonize} from "../utils/functions";


export class ApiClient {
    static get(endpoint, parameters) {
        const apiUrl = document.body.dataset.apiUrl || "";

        return fetch(`${urlJoin(apiUrl, endpoint)}?${queryString.stringify(pythonize(parameters))}`)
            .then(response => response.json())
            .then(json => pythonize(json, true));
    }

    static getSongs({page=1, pageSize=24, ...filters}) {
        return ApiClient.get('/api/songs/', {page, page_size: pageSize, ...filters});
    }
}
