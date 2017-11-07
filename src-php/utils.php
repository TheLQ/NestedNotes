<?php

// Report everything
error_reporting(-1);

ini_set("display_errors", 1);
ini_set("track_errors", 1);
ini_set("html_errors", 1);

// Crash on warnings
function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
}
set_error_handler("exception_error_handler");

function echoHead() {
    ?>
<html>
<head>
    <title>Quick-n-easy treenotes</title>
    <link rel=StyleSheet href="main.css" type="text/css"/>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.27.0/commonmark.min.js"></script>
    <script type="text/javascript" src="main.js"></script>
</head>
<body>
    <?php
}

function parseJson($raw) {
    $json = json_decode($raw, true);

    $error = json_last_error();
    if ($error != 0) {
        // Define the errors.
        $constants = get_defined_constants(true);
        $json_errors = array();
        foreach ($constants["json"] as $name => $value) {
            if (!strncmp($name, "JSON_ERROR_", 11)) {
                $json_errors[$value] = $name;
            }
        }

        die("Failed to parse json " . $json_errors[$error]);
    }

    return $json;
}

function loadDataFile() {
    $test = file_get_contents("example.json");
    if ($test === FALSE) {
        die("failed to load data file");
    }
    return $test;
}

function loadData() {
    return parseJson(loadDataFile());
}

function saveData($data) {
    $newJson = json_encode($data, JSON_PRETTY_PRINT);
    if ($newJson === FALSE) {
        die("failed to save json");
    }
    saveDataRaw($newJson);
}

function saveDataRaw($newJson) {
    $saveResult = file_put_contents("example.json", $newJson);
    if ($saveResult === FALSE) {
        die("failed to save data file");
    }

    $counter = file_get_contents("example.json.counter");
    if ($counter === FALSE) {
        die("failed to load counter");
    }

    $counter++;
    $saveResult = file_put_contents("example.json.".$counter, $newJson);
    if ($saveResult === FALSE) {
        die("failed to save data file backup");
    }

    $saveResult = file_put_contents("example.json.counter", $counter);
    if ($saveResult === FALSE) {
        die("failed to save data counter");
    }
}

function getParam($name) {
    if (!isset($_GET[$name])) {
        die("missing get parameter $name");
    }
    return $_GET[$name];
}

function assertNotFail($var, $error) {
    if ($var === FALSE) {
        throw new Exception("Unexpected FALSE, " + $error);
    } else if ($var === null) {
        throw new Exception("Unexpected NULL, " + $error);
    }
}

function makeArrayIfNotExist(array &$obj, $name) {
    if (!is_array($obj)) {
        throw new Exception("expected array");
    }

    if (!isset($obj[$name])) {
        $obj[$name] = array();
    }
}

function strposArray(string $haystack, array $needles, $offset = 0) {
    foreach ($needles as $needle) {
        $pos = strpos($haystack, $needle, $offset);
        if ($pos !== FALSE) {
            return $pos;
        }
    }
    return FALSE;
}

function linkify($text)  {
    $caret = 0;
    while (true) {
        $caret = strposArray($text, array("http://", "https://"), $caret);
        if ($caret === FALSE) {
            break;
        }
        // echo "<br/>".$caret;
        $end = strpos($text, " ", $caret);
        if ($end === FALSE) {
            $end = strlen($text);;
            // echo "NO SPACE".PHP_EOL;
        }
        // echo "END $end".PHP_EOL;

        $link = substr($text, $caret, $end - $caret);

        $newEnd = $end;

        $add = "</a>";
        $newEnd += strlen($add);
        $text = substr_replace($text, $add, $end, 0);

        $add = "<a href='$link'>";
        $newEnd += strlen($add);
        $text = substr_replace($text, $add, $caret, 0);

        $caret = $newEnd;
    }

    return $text;
}

function delinkify($textpld)  {
    $caret = 0;
    $links = array();
    $text = $textpld;
    while (true) {
        $caret = strposArray($text, array("http://", "https://"), $caret);
        if ($caret === FALSE) {
            break;
        }
        // echo "<br/>".$caret;
        $end = strpos($text, " ", $caret);

        if ($end === FALSE) {
            $end = strlen($text);
            echo "<br/>End: EOL";
            // echo "NO SPACE".PHP_EOL;
        } else {
            echo "<br/>End: $end";
        }

        // echo "END $end".PHP_EOL;

        $links[] = substr($text, $caret, $end - $caret);
        $text = substr_replace($text, "", $caret, $end - $caret);
        continue;



        $newEnd = $end;

        $add = "</a>";
        $newEnd += strlen($add);
        $text = substr_replace($text, $add, $end, 0);

        $add = "<a href='$link'>";
        $newEnd += strlen($add);
        $text = substr_replace($text, $add, $caret, 0);

        $caret = $newEnd;


    }

    return array("links" => $links, "text" => $text);
}