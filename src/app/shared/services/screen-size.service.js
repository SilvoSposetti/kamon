"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
/* Provides observables for real-time screen width and height */
var ScreenSizeService = (function () {
    function ScreenSizeService() {
        var windowSize = createWindowSize();
        this.width = windowSize.pluck('width').distinctUntilChanged();
        this.height = windowSize.pluck('height').distinctUntilChanged();
    }
    ScreenSizeService.prototype.getWidth = function () {
        return this.width;
    };
    ScreenSizeService.prototype.getHeight = function () {
        return this.height;
    };
    return ScreenSizeService;
}());
ScreenSizeService = __decorate([
    core_1.Injectable()
], ScreenSizeService);
exports.ScreenSizeService = ScreenSizeService;
var createWindowSize = function () {
    return rxjs_1.Observable.fromEvent(window, 'resize')
        .map(getWindowSize)
        .startWith(getWindowSize())
        .publishReplay(1)
        .refCount();
};
var getWindowSize = function () {
    return {
        height: window.innerHeight,
        width: window.innerWidth
    };
};
