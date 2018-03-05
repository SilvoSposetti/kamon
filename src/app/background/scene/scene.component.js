"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var SceneComponent = (function () {
    function SceneComponent(screenSizeService, scenesService) {
        this.screenSizeService = screenSizeService;
        this.scenesService = scenesService;
    }
    SceneComponent.prototype.ngOnInit = function () {
        this.getSceneNr();
        this.scenesArray = this.scenesService.getSceneArray();
        this.updateWindowSize();
        this.scenesService.startScenes();
    };
    SceneComponent.prototype.updateWindowSize = function () {
        var _this = this;
        this.widthSubscription = this.screenSizeService.getWidth().subscribe(function (value) {
            _this.screenWidth = value;
        });
        this.heightSubscription = this.screenSizeService.getHeight().subscribe(function (value) {
            _this.screenHeight = value;
        });
    };
    SceneComponent.prototype.getSceneNr = function () {
        var _this = this;
        this.scenesSubscription = this.scenesService.getSceneNr().subscribe(function (value) {
            _this.sceneNr = value;
        });
    };
    return SceneComponent;
}());
SceneComponent = __decorate([
    core_1.Component({
        selector: 'app-scene',
        templateUrl: './scene.component.html',
        styleUrls: ['./scene.component.css']
    })
], SceneComponent);
exports.SceneComponent = SceneComponent;
