function setTagName(newTag) {
    document.getElementsByName("tag")[0].value = newTag;
}

var md_reader = new commonmark.Parser();
var md_writer = new commonmark.HtmlRenderer();

function makeMarkdown(raw) {
    var parsed = md_reader.parse(raw);
    var rendered = md_writer.render(parsed);
    
    if ((rendered.match(/<p>/g) || []).length == 1) {
        rendered = rendered.replace("<p>", "");
        rendered = rendered.replace("</p>", "");
    } else {
        rendered = rendered.replace("<p>", "<br/>");
        rendered = rendered.replace("</p>", "");
    }
    return rendered;
}

window.addEventListener("load",function(){
    // render index
    for (textElem of document.getElementsByClassName("entryText")) {
        textElem.innerHTML = makeMarkdown(textElem.innerHTML);
    }

    // render edit
    let editBoxes = document.getElementsByName("newEdit");
    if (editBoxes.length != 0) {
        editBox = editBoxes[0];
        let preview = document.getElementById("preview");
        $(editBox).change(function() {
            console.log("rendering change " + this.value);
            preview.innerHTML = makeMarkdown(this.value);
        })
        $(editBox).keyup(function(event) {
            console.log("rendering keypress " + this.value);
            preview.innerHTML = makeMarkdown(this.value);
            console.log("event", event)
            if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
                editBox.form.submit();
            }
        })
        preview.innerHTML = makeMarkdown(editBox.value);
    }
});