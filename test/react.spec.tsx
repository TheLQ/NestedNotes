import { expect } from "chai";
import "mocha";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Renderer from 'react-test-renderer/shallow';

import * as Config from "../src/config";
import * as Main from "../src/main";
import * as Item from "../src/ui/item";
import * as List from "../src/ui/list";

describe("greeter", () => {
  it("should say Hello to the World", () => {
    const renderer = Renderer.createRenderer();
    
    renderer.render(Main.makeReactComponent());

 const checkboxNode = ReactDOM.findDOMNode(checkbox);

    let output = renderer.getRenderOutput();
    console.log(output.props);
    debugger;
    expect(output.props.keys().join(", ")).to.equal(2);

    // console.log("root" + typeof(root))
    // debugger;
    // root.toJSON().
    // const rootJson = root.toJSON();
    // expect(rootJson).to.equal(2)

    // console.log("rootJson", rootJson);
    // expect(rootJson.children).to.equal([
      // <Item.Component itemTree={Config.activeConfig.notes[0]}  />,
    //   <Item.Component itemTree={Config.activeConfig.notes[0]}  />
    // ]);
  });
  it("should saydd Hello to the World", () => {
    expect(1 + 1).to.equal(2);
  });
});
