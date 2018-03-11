import queryString from "query-string";


export class ApiClient {
    static get(endpoint, parameters) {
        return fetch(`${endpoint}?${queryString.stringify(parameters)}`).then(response => response.json());
    }

    static getSongs({page=1, pageSize=24}) {
        return ApiClient.get('/api/songs/', { page, page_size: pageSize });
    }
}
