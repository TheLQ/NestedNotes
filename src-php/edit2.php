<?php

declare(strict_types=1);

class EntryData {
    private $entryStack;

    function __constructor(&$notes) {
        $this->entryStack = array();
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
                $this->entryStack[] =& $curEntry;

                if (!isset($curEntry["nested"])) {
                    break;
                }

                $curList =& $curEntry["nested"];
            }
        }
    }

    /*
    Get Entry by depth. MUST USE REFERENCE WHEN CALLING: &$data->getStackEntry(1)
    $depth=0 - Selected entry
    $depth=1 - Selected entry parent 
    */
    function getStackEntry(int $depth): array {
        return $this->entryStack[sizeof($this->entryStack) - 1];
    }
}

abstract class Handler {
    abstract protected function handleSubmit(EntryData $entry): array; // data
    abstract protected function handleGet(EntryData $entry): string;
}

abstract class EditHandler extends Handler {
    function handleSubmit(EntryData $entry): array {

    }

    function handleGet(EntryData $entry): string {
        return <<<EOD
            <h1>{$this->getTitle()}</h1>
            <form action='edit.php?{$_SERVER['QUERY_STRING']}' method='post'>
            {$this->getFormHTML()}
            <br/>
            <input type='submit' value='submit'/>
            </form>
EOD;
    }

    abstract protected function getTitle(EntryData $entry);

    protected function getFormHTML(EntryData $entry) {
        return <<<EOD
        <textarea rows='20' cols='80' name='newEdit'>$text</textarea>
        <div id='preview'></div>
EOD;
    }
}



$typeHandlers = array();

$selectedHandler = $typeHandlers[getParam("mode")];
if (!isset($_POST["submit"])) {
    $data = $selectedHandler.handleSubmit();

    saveData($data);

    header('Location: index.php');
    return;
} else {
    echoHead();
    echo $selectedHandler.handleGet();
}

$typeHandlers["entryNewSibling"] = null;