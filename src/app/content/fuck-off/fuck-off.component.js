"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var FuckOffComponent = (function () {
    function FuckOffComponent(fuckOffService) {
        this.fuckOffService = fuckOffService;
        this.fuckOffArray = ['', ''];
    }
    FuckOffComponent.prototype.ngOnInit = function () {
        this.requestFuckOff();
    };
    FuckOffComponent.prototype.requestFuckOff = function () {
        var _this = this;
        this.fuckOffService.getFuckOff().subscribe(function (value) {
            _this.fuckOffArray = value;
        });
    };
    return FuckOffComponent;
}());
FuckOffComponent = __decorate([
    core_1.Component({
        selector: 'app-fuck-off',
        templateUrl: './fuck-off.component.html',
        styleUrls: ['./fuck-off.component.css']
    })
], FuckOffComponent);
exports.FuckOffComponent = FuckOffComponent;
