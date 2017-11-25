import {Provider} from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import {Router} from "./components/Router";
import {store} from "./models/store";


ReactDOM.render(
    <Provider {...store}>
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("application")
);
