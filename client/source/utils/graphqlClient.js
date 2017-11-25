const dataset = document.body.dataset;

export class GraphqlClient {
    static post(query) {
        const {csrfToken, graphqlPath} = dataset;
        return fetch(
            `${graphqlPath}?query=${encodeURI(query)}`,
            {
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json",
                    "X-CSRFToken": csrfToken
                },
                method: "POST"
            }
        ).then((response) => {
            return response.json();
        });
    }
}
