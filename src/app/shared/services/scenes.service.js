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
var ScenesService = (function () {
    function ScenesService(configService) {
        this.configService = configService;
        this.selectedSceneNrSubject = new Subject_1.Subject();
    }
    ScenesService.prototype.setSceneFromName = function (sceneName) {
        this.selectedSceneName = sceneName;
        this.selectedSceneNr = this.scenesArray.indexOf(this.selectedSceneName);
        this.selectedSceneNrSubject.next(this.selectedSceneNr);
    };
    ScenesService.prototype.setSceneFromNr = function (sceneNr) {
        this.selectedSceneNr = sceneNr;
        this.selectedSceneName = this.scenesArray[this.selectedSceneNr];
        this.selectedSceneNrSubject.next(this.selectedSceneNr);
    };
    ScenesService.prototype.getSceneNr = function () {
        return this.selectedSceneNrSubject.asObservable();
    };
    ScenesService.prototype.getSceneArray = function () {
        return this.scenesArray;
    };
    ScenesService.prototype.startScenes = function () {
        // Add new scenes in array below!
        this.scenesArray = ['asteroids', 'phyllotaxy', 'maze', 'perlin-field'];
        this.setSceneFromName(this.configService.getConfig().defaultScene);
    };
    return ScenesService;
}());
ScenesService = __decorate([
    core_1.Injectable()
], ScenesService);
exports.ScenesService = ScenesService;
