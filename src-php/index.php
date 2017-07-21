<?php

require 'utils.php';
echoHead();

$data = loadData();

echo "<h1>" . $data["globalsettings"]["name"] . "</h1>";

function makeEditLink($entryIndex, $mode, $name) {
    return "<a href='edit.php?index=$entryIndex&mode=$mode'>$name</a>";
}

function recursiveTree($root, $indexStr, $depth) {
    if (!is_array($root)) {
        die("unexpected type of root");
    } elseif (sizeof($root) === 0) {
        return;
    }

    // $listStyle = ($depth % 2 == 0) ? "genericEven" : "genericOdd";
    // echo "<ul class='$listStyle'>";
    $listStyle = "background-color: " . (($depth % 2 == 0) ? "#333333" : "#121212");
    echo "<ul>";
    

    foreach($root as $entryId => $entry) {
        $entryIndex = $indexStr . $entryId . ",";
        echo "<li style='$listStyle'> ";
        if (isset($entry["tags"])) {
            foreach ($entry["tags"] as $tag) {
                echo "<span class='tag'>$tag ";
                echo makeEditLink($entryIndex, "entryDeleteTag&tag=$tag", "X", "a");
                echo "</span>";
            }
            if (sizeof($entry["tags"]) > 0) {
                echo " ";
            }
        }

        // parse text
        echo PHP_EOL;
        echo PHP_EOL;
        $text = linkify($entry["text"]);

        echo "<span class='entryText'>" . $text . "</span>";

        //&nbsp;&nbsp;&nbsp;
        echo "<ul class='links'>";
        echo "<li>".makeEditLink($entryIndex, "entryEdit", "Edit")."</li>";
        // echo " | ";
        echo "<li>".makeEditLink($entryIndex, "entryNewSibling", "NewSibling")."</li>";
        // echo " | ";
        echo "<li>".makeEditLink($entryIndex, "entryNewNested", "NewNested")."</li>";
        // echo " | ";

        $navLinks = array();
        if ($entryId !== 0) {
            $navLinks[] = "<li>".makeEditLink($entryIndex, "entryUp", "Up")."</li>";
        }
        if ($entryId !== sizeof($root) - 1) {
            $navLinks[] = "<li>".makeEditLink($entryIndex, "entryDown", "Down")."</li>";
        }
        if ($depth !== 0) {
            $navLinks[] = "<li>".makeEditLink($entryIndex, "entryLeft", "Left")."</li>";
        }
        if ($entryId !== 0) {
            $navLinks[] = "<li>".makeEditLink($entryIndex, "entryRight", "Right")."</li>";
        }
        foreach ($navLinks as $navLink) {
            echo $navLink;
        }
        // echo join(" ", $navLinks);
        // echo " | ";
        echo "<li>".makeEditLink($entryIndex, "entryDelete", "Delete")."</li>";
        // echo " | ";
        echo "<li>".makeEditLink($entryIndex, "entryNewTag", "NewTag")."</li>";
        echo "</ul>";

        if (isset($entry["nested"])) {
            recursiveTree($entry["nested"], $entryIndex, $depth + 1);
        }
        echo "</li>";
    }

    echo "</ul>";
}

recursiveTree($data["notes"], "", 0);