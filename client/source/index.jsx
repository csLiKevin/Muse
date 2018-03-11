import {Provider} from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import {Client} from "./components/Client";
import {store} from "./models/store";


if (process.env.NODE_ENV !== "production") {
    // Allow console access to the store during development.
    window.store = store;
}

ReactDOM.render(
    <Provider {...store}>
        <BrowserRouter>
            <Client/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("application")
);
