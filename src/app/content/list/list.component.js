"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ListComponent = (function () {
    // First level are categories, second the element of each category, and third the values of each element
    function ListComponent(configService, searchService) {
        this.configService = configService;
        this.searchService = searchService;
        this.configList = this.configService.getConfig().list;
        this.categories = [];
        this.elements = []; // Tri-dimensional array!
    }
    ListComponent.prototype.ngOnInit = function () {
        //this.updateWindowSize();
        this.readList();
        this.searchService.setList(this.elements);
    };
    ListComponent.prototype.readList = function () {
        // Extracts categories (without duplicates) and info about search engine from the list.
        for (var i = 0; i < this.configList.length; i++) {
            if (this.categories.indexOf(this.configList[i][0]) === -1) {
                this.categories.push(this.configList[i][0]);
            }
        }
        // Initializes the elements array to have the correct amount of categories
        for (var i = 0; i < this.categories.length; i++) {
            this.elements.push([]);
        }
        // Inserts a list of values for each element under its correct category in elements array
        for (var i = 0; i < this.configList.length; i++) {
            var indexOfCategory = this.categories.indexOf(this.configList[i][0]);
            var elementValues = [];
            for (var j = 1; j < this.configList[i].length; j++) {
                // (starts from 1 instead of 0)
                elementValues.push(this.configList[i][j]);
            }
            this.elements[indexOfCategory].push(elementValues);
        }
    };
    ListComponent.prototype.openLink = function (i, j) {
        if (this.configService.getConfig().openLinkInNewTab) {
            window.open(this.elements[i][j][2], '_blank');
        }
        else {
            window.location.href = this.elements[i][j][2];
        }
    };
    return ListComponent;
}());
ListComponent = __decorate([
    core_1.Component({
        selector: 'app-list',
        templateUrl: './list.component.html',
        styleUrls: ['./list.component.css']
    })
], ListComponent);
exports.ListComponent = ListComponent;
