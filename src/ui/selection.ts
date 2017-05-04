import * as Config from '../config';
import * as EventHandlers from "./eventHandlers";

type IteratorUntilTrue = (currentItem: Config.Item) => boolean;

enum SelectionState {
    Enabled,
    Trigger,
    Done,
}

let activeSelection: Config.Item = Config.activeConfig.notes[0];
// select on init

// window.addEventListener("load", function initSelection() {
console.log("load selection")
EventHandlers.postReactInit.push((config: Config.Root) => {
    console.log("setting first active selection");
    Config.react(activeSelection).setState({
        isSelected: true,
    });
})

export function init() {
    console.log("init selection")

}

function updateSelection(newSelection: Config.Item) {
    // skip during init
    Config.react(activeSelection).setState({
        isSelected: false,
    });
    Config.react(newSelection).setState({
        isSelected: true,
    });
    activeSelection = newSelection;
}

function selectionNext() {
    /* Use dummy item to work around weird typescript problem
    *
    * var result: Config.Item | null = null; // or undefined
    * iterate(myIteratorThatSetsResult)
    * if (result == null) {
    *  throw error()
    * } else if (result.childProperty.something == something) {
    *  // above gives error TS2339: Property 'reactComponent' does not exist on type 'never'.
    * }
    */
    let result: Config.Item = activeSelection;
    let trigger = false;
    iterate(function selectionPump(currentItem: Config.Item): boolean {
        console.info("tested ", result, currentItem)
        if (result === currentItem) {
            trigger = true;
            return false;
        } else if (!trigger) {
            return false;
        }

        result = currentItem;
        return true;
    });

    if (result == activeSelection) {
        throw new Error("did not advance item");
    }

    updateSelection(result);
}

function selectionPrev() {
    let result: Config.Item = activeSelection;
    let trigger = false;
    iterate(function selectionPump(currentItem: Config.Item): boolean {
        if (result === currentItem) {
            return true;
        } else if (!trigger) {
            result = currentItem;
            return true;
        }

        return false;
    });

    if (result == activeSelection) {
        throw new Error("did not advance item");
    }

    updateSelection(result);
}

function iterate(test: IteratorUntilTrue) {
    /* Start: could be extracted if needed */
    Config.activeConfig.notes.forEach(function iteratePump(rootItem, i) {
        console.log("iterating children of " + rootItem.text + " index " + i);
        let current = rootItem;
        let stack: Config.Item[] = [];
        while (true) {
            console.log("stack " + stack.length + " current ", current);
            current = _iterateNext(stack, current, test);
            if (current === BREAK_ITEM) {
                break;
            } else if (stack.length === 0) {
                throw new Error("stack length 0");
            }
        }
    });
    /* End: could be extracted if needed */
}


const CODE_BREAK = -1;



const BREAK_ITEM: Config.Item = {
    id: -1,
    text: "break"
}

function _iterateNext(stack: Config.Item[], currentItem: Config.Item, test: IteratorUntilTrue): Config.Item/**next*/ {
    if (test(currentItem)) {
        console.info("test matched", currentItem)
        return BREAK_ITEM;
    }

    // descend directly to nested item
    if (currentItem.nested && currentItem.nested.length > 0) {
        stack.push(currentItem);
        return currentItem.nested[0];
    }

    // find usable parent
    let stackChild = currentItem;
    while (stack.length != 0) {
        let stackCurrent = stack[stack.length - 1];
        if (!stackCurrent.nested) {
            // make compiler happy
            throw new Error("parent doesn't contain it's child?");
        }

        let currentIndex = stackCurrent.nested.indexOf(stackChild);
        if (currentIndex == -1) {
            throw new Error("couldn't find child in parent?");
        }
        if (currentIndex < stackCurrent.nested.length - 1) {
            // next
            return stackCurrent.nested[++currentIndex];
        } else {
            // done with parent
            stack.pop();
            stackChild = stackCurrent;
        }
    }

    console.error("no usable parent found")
    return BREAK_ITEM;
}

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
    console.log("e", e);
    if (e.charCode === "j".charCodeAt(0)) {
        selectionNext();
    } else if (e.charCode === "k".charCodeAt(0)) {
        selectionPrev();
    }
});