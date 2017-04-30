"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";
import * as EventHandler from "./ui/eventHandlers";
import * as List from "./ui/list";

const rootComponent = ReactDOM.render(
    <List.Component list={Config.activeConfig.notes} />,
    document.getElementById("replaceMe"),
) as List.Component;

EventHandler.onPostReactInit(rootComponent);
