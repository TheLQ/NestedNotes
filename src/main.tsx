"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";
import * as EventHandler from "./ui/eventHandlers";
import * as List from "./ui/list";

// initialize 
import "./ui/selection";

window.addEventListener('error', (e) => {
    // e instanceof ErrorEvent
    console.error('caught the error: ', e);
});

window.addEventListener("load", function initReact() {
    ReactDOM.render(
        <List.Component
            list={Config.activeConfig.notes}
            ref={(rootComponent) => {
                /*EventHandler.onPostReactInit(rootComponent, Config.activeConfig);*/
            }}
        />,
        document.getElementById("replaceMe"),
    );
    console.log("after render");
    // console.log('done2', rootComponent);

    EventHandler.onPostReactInit(Config.activeConfig);
});
console.log("load");
