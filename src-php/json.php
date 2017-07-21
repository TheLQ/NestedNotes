<?php

require 'utils.php';

if (isset($_GET["mode"]) && $_GET["mode"] === "save") {
    saveData($_POST);
} else {
    echo loadDataFile();
}