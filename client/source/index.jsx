import {Provider} from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import {Client} from "./components/Client";
import {store} from "./models/store";


ReactDOM.render(
    <Provider {...store}>
        <BrowserRouter>
            <Client/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("application")
);
