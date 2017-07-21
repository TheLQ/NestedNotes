<?php

class EntryItem {
    public $text;
    public $nested;
    public $links;
    public $id;

    function __construct(array $itemEntry) {
        $this->text = $itemEntry["text"];
        if (isset($itemEntry["nested"])) {
            $this->nested = $itemEntry["nested"];
        } else {
            $this->nested = [];
        }
    }

    function setTex($text) {
        $this->text = $text;
    }
}



