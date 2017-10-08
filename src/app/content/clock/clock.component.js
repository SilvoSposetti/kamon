"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ClockComponent = (function () {
    function ClockComponent(clockService) {
        this.clockService = clockService;
    }
    ClockComponent.prototype.ngOnInit = function () {
        this.updateTime();
    };
    ClockComponent.prototype.updateTime = function () {
        var _this = this;
        this.timeSubscription = this.clockService.getSecondsFirstDigit().subscribe(function (value) {
            _this.secondsFirstDigit = value;
        });
        this.timeSubscription = this.clockService.getSecondsSecondDigit().subscribe(function (value) {
            _this.secondsSecondDigit = value;
        });
        this.timeSubscription = this.clockService.getMinutesFirstDigit().subscribe(function (value) {
            _this.minutesFirstDigit = value;
        });
        this.timeSubscription = this.clockService.getMinutesSecondDigit().subscribe(function (value) {
            _this.minutesSecondDigit = value;
        });
        this.timeSubscription = this.clockService.getHoursFirstDigit().subscribe(function (value) {
            _this.hoursFirstDigit = value;
        });
        this.timeSubscription = this.clockService.getHoursSecondDigit().subscribe(function (value) {
            _this.hoursSecondDigit = value;
        });
        this.timeSubscription = this.clockService.getDate().subscribe(function (value) {
            _this.day = value;
        });
        this.timeSubscription = this.clockService.getMonth().subscribe(function (value) {
            _this.month = value;
        });
        this.timeSubscription = this.clockService.getYear().subscribe(function (value) {
            _this.year = value;
        });
        this.timeSubscription = this.clockService.getDay().subscribe(function (value) {
            _this.dayOfWeek = value;
        });
        this.clockService.resetClock();
    };
    return ClockComponent;
}());
ClockComponent = __decorate([
    core_1.Component({
        selector: 'app-clock',
        templateUrl: './clock.component.html',
        styleUrls: ['./clock.component.css']
    })
], ClockComponent);
exports.ClockComponent = ClockComponent;
