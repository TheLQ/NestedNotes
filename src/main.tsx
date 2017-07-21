"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";
import * as EventHandler from "./ui/eventHandlers";
import * as List from "./ui/list";
import * as Error from "./ui/error";

// initialize 
import "./ui/selection";
import "./ui/edit";

// window.addEventListener('error', (e) => {
//     // e instanceof ErrorEvent
//     console.error('caught the error: ', e);
// });

window.addEventListener("load", main);

export function main() {
    console.log("load EventListener");
    // console.log('done2', rootComponent);

    jQuery.ajax({
        url: "../src-php/json.php",
        dataType: "json"
    }).done((data) => {
        console.log("fetched data", data);
        Config.setActiveConfig(data);
        ReactDOM.render(
            makeReactComponent(),
            document.getElementById("replaceMe"),
        );

        EventHandler.onPostReactInit(Config.getActiveConfig());

        let loading = document.getElementById("loading")
        if (loading != undefined) {
            loading.outerHTML = "";
        }
    });   
}

export function makeReactComponent() {
    return (
        <div>
            <Error.Component ref={(errorComponent) => {
                if (errorComponent != null) {
                    Error.setComponent(errorComponent);
                }
            }} />
            <List.Component
                list={Config.getActiveConfig().notes}
                even={true}
                ref={(rootComponent) => {
                {/* EventHandler.onPostReactInit(rootComponent, Config.activeConfig); */}
                }}
            />
        </div>
    )
} 

console.log("main end");
