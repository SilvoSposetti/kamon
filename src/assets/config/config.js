"use strict";
exports.__esModule = true;
var Configuration = (function () {
    // Important: this constructor and the config.json file must have the same mapping to work properly!
    function Configuration(useCustomBackgroundImage, useScene, defaultScene, showClock, showFuckOff, openLinkInNewTab, showList, suggestions, searchDelimiter, amountOfSuggestions, searchEngine, list) {
        this.useCustomBackgroundImage = useCustomBackgroundImage;
        this.useScene = useScene;
        this.defaultScene = defaultScene;
        this.showClock = showClock;
        this.showFuckOff = showFuckOff;
        this.openLinkInNewTab = openLinkInNewTab;
        this.showList = showList;
        this.suggestions = suggestions;
        this.searchDelimiter = searchDelimiter;
        this.amountOfSuggestions = amountOfSuggestions;
        this.searchEngine = searchEngine;
        this.list = list;
    }
    return Configuration;
}());
exports.Configuration = Configuration;
