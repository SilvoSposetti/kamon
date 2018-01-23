"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var SceneSelectorComponent = (function () {
    function SceneSelectorComponent(scenesService) {
        this.scenesService = scenesService;
    }
    SceneSelectorComponent.prototype.ngOnInit = function () {
        this.getSceneNr();
        this.scenesNamesList = this.scenesService.getSceneArray();
    };
    SceneSelectorComponent.prototype.clickScene = function (index) {
        this.scenesService.setSceneFromNr(index);
    };
    SceneSelectorComponent.prototype.getSceneNr = function () {
        var _this = this;
        this.scenesSubscription = this.scenesService.getSceneNr().subscribe(function (value) {
            _this.selectedSceneNr = value;
        });
    };
    return SceneSelectorComponent;
}());
SceneSelectorComponent = __decorate([
    core_1.Component({
        selector: 'app-scene-selector',
        templateUrl: './scene-selector.component.html',
        styleUrls: ['./scene-selector.component.css']
    })
], SceneSelectorComponent);
exports.SceneSelectorComponent = SceneSelectorComponent;
