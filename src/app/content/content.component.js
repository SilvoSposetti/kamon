"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ContentComponent = (function () {
    function ContentComponent(searchService) {
        this.searchService = searchService;
    }
    ContentComponent.prototype.ngOnInit = function () {
        this.showSearch = false;
        this.listenForSearch();
    };
    ContentComponent.prototype.listenForSearch = function () {
        var _this = this;
        this.searchSubscription = this.searchService.getSearch().subscribe(function (value) {
            _this.searchText = value;
            if (value.length === 0) {
                _this.checkShowSearch();
            }
        });
        this.suggestionsSubscription = this.searchService.getSuggestions().subscribe(function (value) {
            _this.searchSuggestions = value;
        });
        this.shortcutSubscription = this.searchService.getShortcut().subscribe(function (value) {
            _this.shortcut = value;
        });
    };
    ContentComponent.prototype.searchInputChanged = function () {
        this.searchService.setSearchString(this.searchText); // Update content of searchString
        this.checkShowSearch();
    };
    ContentComponent.prototype.checkShowSearch = function () {
        this.showSearch = !(this.searchText.length === 0);
    };
    return ContentComponent;
}());
__decorate([
    core_1.Input()
], ContentComponent.prototype, "showList");
__decorate([
    core_1.Input()
], ContentComponent.prototype, "selectionSuggestion");
__decorate([
    core_1.Input()
], ContentComponent.prototype, "showSceneSelector");
__decorate([
    core_1.Input()
], ContentComponent.prototype, "showClock");
__decorate([
    core_1.Input()
], ContentComponent.prototype, "showFuckOff");
ContentComponent = __decorate([
    core_1.Component({
        selector: 'app-content',
        templateUrl: './content.component.html',
        styleUrls: ['./content.component.css']
    })
], ContentComponent);
exports.ContentComponent = ContentComponent;
