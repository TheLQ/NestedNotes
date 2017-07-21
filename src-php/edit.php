<?php

require 'utils.php';

$data = loadData();
$notes =& $data["notes"];

$selectedIndex = getParam("index");
$mode = getParam("mode");

$entryStack = array();
{
    $curList =& $notes;
    foreach(explode(",", $selectedIndex) as $curIndex) {
        if ($curIndex === "") {
            break;
        }
        $entryDebug = "<br/><pre>".var_export($curList, true)."</pre>";

        if (!isset($curList[$curIndex])) {
            die("failed to find $curIndex in ".$entryDebug);
        }
        $curEntry =& $curList[$curIndex];
        $entryStack[] =& $curEntry;

        if (!isset($curEntry["nested"])) {
            break;
        }

        $curList =& $curEntry["nested"];
    }
}

// useful reference
$selectedEntry =& $entryStack[sizeof($entryStack) - 1];
assertNotFail($selectedEntry, "Failed to get current entry");
if (sizeof($entryStack) === 1) {
    $entryParentArray =& $notes;
    $entryParent = null;
    $entryGrandParentArray = null;
} else {
    $entryParent =& $entryStack[sizeof($entryStack) - 2];
    $entryParentArray =& $entryParent["nested"];
    if (sizeof($entryStack) > 2) {
        $entryGrandParentArray =&$entryStack[sizeof($entryStack) - 3]["nested"];
    } else {
        $entryGrandParentArray =& $notes;
    }
}
assertNotFail($entryParentArray, "Failed to get current entry parent array");
$entryIndex = array_search($selectedEntry, $entryParentArray, true);
assertNotFail($entryParentArray, "Unable to find entry in parent");

function edit($title, $callback) {
    echoHead();
    echo "<h1>$title</h1>";
    echo "<form action='edit.php?{$_SERVER['QUERY_STRING']}' method='post'>";
    $callback();
    echo "<br/>";
    echo "<input type='submit' value='submit'/>";
    echo "</form>";
}

function editTextBox($title, $text, ...$callbacks) {
    edit($title, function() use ($text, $callbacks) {
        echo "<textarea rows='20' cols='80' name='newEdit'>$text</textarea>";
        echo "<div id='preview'></div>";
        if (isset($callbacks)) {
            foreach ($callbacks as $callback) {
                $callback();
            }
        }
    });
}

function editTextBoxBulk($title, $text) {
    editTextBox($title, $text, function() {
        echo "<br/>";
        echo "<input type='checkbox' id='bulkAdd' name='bulkAdd'/>";
        echo "<label for='bulkAdd'>Bulk Add</label>";
    });
}

function newToArray() {
    if (isset($_POST['bulkAdd'])) {
        $toInsert = array();
        foreach(explode(PHP_EOL, $_POST["newEdit"]) as $line) {
            $toInsert[] = array("text" => $line);
        }
    } else {
        $toInsert = array(array("text" => $_POST["newEdit"]));
    }
    return $toInsert;
}

if ($mode === "entryEdit") {
    if (isset($_POST["newEdit"])) {
        $selectedEntry["text"] = $_POST["newEdit"];
        
        saveData($data);

        header('Location: index.php');
        return;
    } else {
        editTextBox(
            "Editing ".$selectedIndex,
            $selectedEntry["text"]
        );
    }
} elseif ($mode === "entryNewSibling") {
    if (isset($_POST["newEdit"])) {
        // insert after
        array_splice(
            $entryParentArray, 
            $entryIndex + 1, 
            0, 
            newToArray()
        );

        saveData($data);

        header('Location: index.php');
        return;
    } else {
        editTextBoxBulk(
            "New sibling under ".$selectedIndex,
            ""
        );
    }
} elseif ($mode === "entryNewNested") {
    if (isset($_POST["newEdit"])) {
        if (!isset($selectedEntry["nested"])) {
            $selectedEntry["nested"] = array();
        }

        array_splice(
            $selectedEntry["nested"],
            0, 
            0, 
            newToArray()
        );
        
        saveData($data);

        header('Location: index.php');
        return;
    } else {
        editTextBoxBulk(
            "New nested under ".$selectedIndex,
            ""
        );
    }
} elseif ($mode === "entryUp") {
    array_splice(
        $entryParentArray, 
        $entryIndex, 
        1
    );
    array_splice(
        $entryParentArray, 
        $entryIndex - 1, 
        0,
        array($curEntry)
    );

    saveData($data);

    header('Location: index.php');
    return;
} elseif ($mode === "entryDown") {
    array_splice(
        $entryParentArray, 
        $entryIndex, 
        1
    );
    array_splice(
        $entryParentArray, 
        $entryIndex + 1, 
        0,
        array($curEntry)
    );

    saveData($data);

    header('Location: index.php');
    return;
} elseif ($mode === "entryLeft") {
    array_splice(
        $entryParentArray,
        $entryIndex,
        1
    );

    $parentIndex = array_search($entryParent, $entryGrandParentArray);
    if ($parentIndex === FALSE) {
        throw new Exception("Failed to find parent in grand parent array");
    }

    array_splice(
        $entryGrandParentArray,
        $parentIndex + 1,
        0,
        array($curEntry)
    );

    saveData($data);

    header('Location: index.php');
    return;
} elseif ($mode === "entryRight") {
    if ($entryIndex === 0) {
        throw new Exception("Cannot move first entry of array left");
    }

    array_splice(
        $entryParentArray,
        $entryIndex,
        1
    );

    $precedingEntry =& $entryParentArray[$entryIndex - 1];

    makeArrayIfNotExist($precedingEntry, "nested");
    $precedingEntry["nested"][] = $curEntry;

    saveData($data);

    header('Location: index.php');
    return;
} elseif ($mode === "entryDelete") {
    array_splice(
        $entryParentArray, 
        $entryIndex, 
        1
    );

    saveData($data);

    header('Location: index.php');
    return;
} elseif ($mode === "entryNewTag") {
    if (isset($_POST["tag"])) {
        if (!isset($curEntry["tags"])) {
            $curEntry["tags"] = array();
        }
        if (!in_array($_POST["tag"], $curEntry["tags"])) {
            $curEntry["tags"][] = $_POST["tag"];
            saveData($data);
        }

        header('Location: index.php');
        return;
    } else {
        edit("new tag", function() {
            ?>
            <input type="text" name="tag"/>
            <script type="text/javascript" src="main.js"></script>
            <?php
        });

        echo "<p>or select from existing</p>";

        $foundTags = array();
        function getTagsRecursive($nested) {
            global $foundTags;
            foreach ($nested as $entry) {
                if (isset($entry["tags"])) {
                    foreach ($entry["tags"] as $tag) {
                        if (!in_array($tag, $foundTags)) {
                            $foundTags[] = $tag;
                        }
                    }
                }
                if (isset($entry["nested"])) {
                    getTagsRecursive($entry["nested"]);
                }
            }
        }
        getTagsRecursive($notes);

        foreach ($foundTags as $tag) {
            echo "<button onclick='setTagName(\"$tag\")'>$tag</button>";
            echo "<br/>";
        }
        
        echo "<br/>";
    }
} elseif ($mode === "entryDeleteTag") {
    $index = array_search($_GET["tag"], $curEntry["tags"]);
    unset($curEntry["tags"][$index]);

    saveData($data);

    header('Location: index.php');
    return;
} else {
    die("unknown mode " . $mode);
}