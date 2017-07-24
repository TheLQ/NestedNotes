<?php

require 'utils.php';
require 'data.php';

$data = loadData();
$notes = &$data["notes"];

// var_dump($notes);

$roots = array();
$newNotes = array();
function applyRecursive(array &$entryList, &$parentId = null) {
    global $newNotes, $roots;
    foreach ($entryList as $item) {
		$id = uniqid();
		if ($parentId != null) {
			$newNotes[$parentId]["children"][] = $id;
			$item["parent"] = $parentId;
		} else {
			$roots[] = $id;
		}

		$item["id"] = $id;
		$newNotes[$id] = $item;

        if (isset($item["nested"]) && $item["nested"] != null) {
            applyRecursive($item["nested"], $id);
        }

		unset($newNotes[$id]["nested"]);
    }
}

applyRecursive($notes);

$data["notes"] = $newNotes;
$data["roots"] = $roots;
// $lis = array();
// applyRecursive($lis);
// $data["notes"] = $lis;


// saveData($data);
$newJson = json_encode($data, JSON_PRETTY_PRINT);
echo $newJson;
$saveResult = file_put_contents("examplenew.json", $newJson);