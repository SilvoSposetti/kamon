"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var ConfigService = (function () {
    function ConfigService(http) {
        this.http = http;
    }
    // used at application startup and loads, maps and returns what is inside the JSON file
    ConfigService.prototype.load = function (url) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(url).map(function (res) { return res.json(); })
                .subscribe(function (config) {
                _this.config = config;
                resolve();
            });
        });
    };
    ConfigService.prototype.getConfig = function () {
        return this.config;
    };
    return ConfigService;
}());
ConfigService = __decorate([
    core_1.Injectable()
], ConfigService);
exports.ConfigService = ConfigService;
