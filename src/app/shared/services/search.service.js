"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var http_1 = require("@angular/http");
var SearchService = (function () {
    function SearchService(jsonP, configService) {
        this.jsonP = jsonP;
        this.configService = configService;
        this.searchStringSubject = new Subject_1.Subject(); // Passed to components as observable
        this.searchString = ''; // Updated and used only here for requestSuggestions();
        this.suggestionsArraySubject = new Subject_1.Subject();
        this.suggestionsArray = [];
        this.suggestionsArrayStyledSubject = new Subject_1.Subject();
        this.selectionSuggestionSubject = new Subject_1.Subject();
        this.selectionSuggestion = -1; // Updated and used only here in the service
        this.elements = []; // Tri-dimensional array!
        // First level are categories, second the element of each category, and third the values of each element
        this.shortcutSubject = new Subject_1.Subject();
        this.shortcut = [];
        this.regex = new RegExp('^\\s+$');
    }
    SearchService.prototype.setSearchString = function (newSearchString) {
        if (newSearchString.match(this.regex)) {
            this.searchString = '';
            this.searchStringSubject.next(this.searchString);
            this.updateShortcut();
            this.requestSuggestions();
            this.resetSelection();
        }
        else {
            this.searchStringSubject.next(newSearchString);
            this.searchString = newSearchString;
            this.updateShortcut();
            this.requestSuggestions();
            this.resetSelection();
        }
    };
    SearchService.prototype.resetSearchString = function () {
        this.searchStringSubject.next('');
        this.searchString = '';
        this.suggestionsArraySubject.next([]);
        this.resetSelection();
    };
    SearchService.prototype.resetSelection = function () {
        this.selectionSuggestion = -1;
        this.selectionSuggestionSubject.next(this.selectionSuggestion);
    };
    SearchService.prototype.getSearch = function () {
        return this.searchStringSubject.asObservable();
    };
    SearchService.prototype.getSelection = function () {
        return this.selectionSuggestionSubject.asObservable();
    };
    SearchService.prototype.getSuggestions = function () {
        return this.suggestionsArrayStyledSubject.asObservable();
    };
    SearchService.prototype.getShortcut = function () {
        return this.shortcutSubject.asObservable();
    };
    SearchService.prototype.setList = function (elements) {
        this.elements = elements;
    };
    SearchService.prototype.requestSuggestions = function () {
        var _this = this;
        if (this.searchString.length < 1) {
            // Do not send an empty suggestion request.
            // Thus return empty array.
            this.suggestionsArray = [];
            this.suggestionsArraySubject.next(this.suggestionsArray);
        }
        else {
            if (!this.configService.getConfig().suggestions) {
                // Config file says suggestions are unnecessary.
            }
            else {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Access-Control-Allow-Origin', '*');
                this.jsonP.request('http://suggestqueries.google.com/complete/search?client=firefox&hl=en&callback=JSONP_CALLBACK&q=' + this.searchString, headers).map(function (res) { return res.json(); }).subscribe(function (response) {
                    _this.suggestionsArray = response[1].slice(0, _this.configService.getConfig().amountOfSuggestions);
                    _this.suggestionsArraySubject.next(_this.suggestionsArray);
                    // Reset suggestions styled and elaborate the new ones;
                    _this.suggestionsArrayStyledSubject.next([]);
                    var newSuggestionsStyled = [];
                    for (var i = 0; i < _this.suggestionsArray.length; i++) {
                        var suggestion = _this.suggestionsArray[i];
                        suggestion = suggestion.replace(_this.searchString, '<i><b>' + _this.searchString + '</i></b>');
                        newSuggestionsStyled.push(suggestion);
                    }
                    _this.suggestionsArrayStyledSubject.next(newSuggestionsStyled);
                });
            }
        }
    };
    SearchService.prototype.launchSearch = function (index) {
        if (this.searchString.length < 1) {
            // do nothing because empty search string
        }
        else {
            if (this.shortcut[0] !== '') {
                if (this.searchString.length === 1) {
                    this.openShortcut();
                }
                else {
                    this.openSearchInShortcut();
                }
            }
            else {
                this.standardSearch(index);
            }
        }
    };
    SearchService.prototype.selectLeft = function () {
        if (this.suggestionsArray.length < 1) {
            this.selectionSuggestion = -1;
            this.selectionSuggestionSubject.next(this.selectionSuggestion);
        }
        else {
            if (this.selectionSuggestion <= 0) {
                this.selectionSuggestion = 0;
                this.selectionSuggestionSubject.next(this.selectionSuggestion);
            }
            else {
                this.selectionSuggestion--;
                this.selectionSuggestionSubject.next(this.selectionSuggestion);
            }
        }
    };
    SearchService.prototype.selectRight = function () {
        if (this.suggestionsArray.length < 1) {
            this.selectionSuggestion = -1;
            this.selectionSuggestionSubject.next(this.selectionSuggestion);
        }
        else {
            if (this.selectionSuggestion >= this.suggestionsArray.length - 1) {
                this.selectionSuggestion = this.suggestionsArray.length - 1;
                this.selectionSuggestionSubject.next(this.selectionSuggestion);
            }
            else {
                this.selectionSuggestion++;
                this.selectionSuggestionSubject.next(this.selectionSuggestion);
            }
        }
    };
    SearchService.prototype.updateShortcut = function () {
        if (this.searchString.length < 1) {
            // Do nothing because empty search string;
        }
        else {
            if (this.searchString.length === 1 || this.searchString.substring(1, 2) === this.configService.getConfig().searchDelimiter) {
                // Update shortcut only if the string is 1 char long or the delimiter is found in the second position of the string.
                var elementFound = [];
                var found = false;
                var firstChar = this.searchString.substring(0, 1);
                for (var i = 0; i < this.elements.length; i++) {
                    for (var j = 0; j < this.elements[i].length; j++) {
                        if (this.elements[i][j][1] === firstChar) {
                            elementFound = this.elements[i][j];
                            found = true;
                        }
                    }
                }
                if (found) {
                    this.shortcut = elementFound;
                    this.shortcutSubject.next(this.shortcut);
                }
                else {
                    this.setStandardShortcut();
                }
            }
            else {
                this.setStandardShortcut();
            }
        }
    };
    SearchService.prototype.setStandardShortcut = function () {
        this.shortcut = ['', '', '', '', 'rgba(0,0,0,0.8)'];
        this.shortcutSubject.next(this.shortcut);
    };
    SearchService.prototype.standardSearch = function (index) {
        var keyword = '';
        if (index === -1) {
            keyword = this.searchString;
        }
        else {
            keyword = this.suggestionsArray[index];
        }
        var link = this.configService.getConfig().searchEngine[1] + this.configService.getConfig().searchEngine[2] + keyword;
        this.openLink(link);
    };
    SearchService.prototype.openShortcut = function () {
        var link = this.shortcut[2];
        this.openLink(link);
    };
    SearchService.prototype.openSearchInShortcut = function () {
        var link = this.shortcut[2];
        if (this.shortcut[3] !== null) {
            link += this.shortcut[3];
            link = link.replace('{}', this.searchString.substring(2));
        }
        this.openLink(link);
    };
    SearchService.prototype.openLink = function (link) {
        if (this.configService.getConfig().openLinkInNewTab) {
            window.open(link, '_blank');
        }
        else {
            window.location.href = link;
        }
    };
    SearchService.prototype.clickedSuggestion = function (index) {
        this.standardSearch(index);
    };
    return SearchService;
}());
SearchService = __decorate([
    core_1.Injectable()
], SearchService);
exports.SearchService = SearchService;
