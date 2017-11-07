<?php

require 'utils.php';

if (isset($_GET["mode"]) && $_GET["mode"] === "save") {
    // Reparse json for pretty printing
    die('nope');
    $json = json_decode($_POST['json']);
    saveData($json);
    // print_r($_POST['json']);
} else {
    echo loadDataFile();
}