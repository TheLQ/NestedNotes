<?php

require 'utils.php';
require 'data.php';

$data = loadData();
$notes = &$data["notes"];

// var_dump($notes);

$id = 0;
function applyRecursive(array &$entryList) {
    global $id;
    foreach ($entryList as &$item) {
        echo "<p>" . $item["text"];

        // $result = delinkify($item->text);
        // $item->setTex(trim($result["text"]));
        $item["id"] = $id++;
        echo "<br/> turns into ".$item["text"] . " as ".$item["id"];
        echo "</p><ol>";
        // foreach ($result["links"] as $link ) {
        //     echo "<li>".$link."</li>";
        // }
        echo "</ol>";

        // $item->links = $result["links"];

        // var_dump($item);

        if (isset($item["nested"]) && $item["nested"] != null) {
            applyRecursive($item["nested"]);
        }
    }
}

applyRecursive($notes);



// $lis = array();
// applyRecursive($lis);
// $data["notes"] = $lis;


// saveData($data);
$newJson = json_encode($data, JSON_PRETTY_PRINT);
echo $newJson;
$saveResult = file_put_contents("examplenew.json", $newJson);