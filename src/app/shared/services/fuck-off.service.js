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
var FuckOffService = (function () {
    function FuckOffService(http) {
        this.http = http;
        this.fuckOffArraySubject = new Subject_1.Subject();
        this.createList();
    }
    FuckOffService.prototype.getFuckOff = function () {
        this.requestRandomFuckOff();
        return this.fuckOffArraySubject.asObservable();
    };
    FuckOffService.prototype.requestRandomFuckOff = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        var randomEndpoint = this.fuckOffList[Math.floor(Math.random() * this.fuckOffList.length)];
        this.http.get('https://www.foaas.com' + randomEndpoint + '/FOAAS', headers).map(function (res) { return res.json(); }).subscribe(function (response) {
            _this.fuckOffArraySubject.next([response.message, response.subtitle]);
        });
    };
    FuckOffService.prototype.createList = function () {
        this.fuckOffList = [
            '/asshole', '/awesome', '/bag', '/because', '/bucket', '/bye', '/cool', '/cup', '/diabetes', '/everyone',
            '/everything', '/family', '/fascinating', '/flying', '/fyyff', '/give', '/horse', '/immensity', '/life',
            '/looking', '/maybe', '/me', '/mornin', '/no', '/pink', '/programmer', '/retard', '/ridiculous', '/rtfm', '/sake',
            '/shit', '/single', '/thanks', '/that', '/this', '/too', '/tucker', '/what', '/zayn', '/zero'
        ];
    };
    return FuckOffService;
}());
FuckOffService = __decorate([
    core_1.Injectable()
], FuckOffService);
exports.FuckOffService = FuckOffService;
