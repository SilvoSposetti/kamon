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
var DaysOfWeek_1 = require("../models/DaysOfWeek");
var ClockService = (function () {
    function ClockService() {
        var _this = this;
        // Need a subject for every element to make sure that each one gets updated only when it changes.
        this.secondsFirstDigitSubject = new Subject_1.Subject();
        this.secondsSecondDigitSubject = new Subject_1.Subject();
        this.minutesFirstDigitSubject = new Subject_1.Subject();
        this.minutesSecondDigitSubject = new Subject_1.Subject();
        this.hoursFirstDigitSubject = new Subject_1.Subject();
        this.hoursSecondDigitSubject = new Subject_1.Subject();
        this.dateSubject = new Subject_1.Subject();
        this.monthSubject = new Subject_1.Subject();
        this.yearSubject = new Subject_1.Subject();
        this.daySubject = new Subject_1.Subject();
        // Used to remember and check if the old value is the same as the new or not.
        this.oldSecondsFirst = '';
        this.oldSecondsSecond = '';
        this.oldMinutesFirst = '';
        this.oldMinutesSecond = '';
        this.oldHoursFirst = '';
        this.oldHoursSecond = '';
        this.oldDate = '';
        this.oldMonth = '';
        this.oldYear = '';
        this.oldDay = '';
        this.daysOfWeek = new DaysOfWeek_1.DaysOfWeek();
        setTimeout(function () {
            _this.updateSubjects();
        }, 1);
        this.startTime();
    }
    ClockService.prototype.startTime = function () {
        var _this = this;
        setInterval(function () {
            _this.updateSubjects();
        }, 1000); // can be set higher and the subjects will only get updated when they change.
    };
    // Creates new date and extracts data. Then updates values only if they changed.
    ClockService.prototype.updateSubjects = function () {
        var newDate = new Date();
        // Seconds
        var seconds = this.correctLength(newDate.getSeconds().toString());
        var secondsFirstDigit = seconds.substring(0, 1);
        var secondsSecondDigit = seconds.substring(1, 2);
        // Minutes
        var minutes = this.correctLength(newDate.getMinutes().toString());
        var minutesFirstDigit = minutes.substring(0, 1);
        var minutesSecondDigit = minutes.substring(1, 2);
        // Hours
        var hours = this.correctLength(newDate.getHours().toString());
        var hoursFirstDigit = hours.substring(0, 1);
        var hoursSecondDigit = hours.substring(1, 2);
        // Rest
        var date = this.correctLength((newDate.getDate().toString()));
        var month = this.correctLength((newDate.getMonth() + 1).toString()); // Months start from 1 when new Date() is created
        var year = this.correctLength(newDate.getFullYear().toString());
        var day = this.translateDayToLanguage(newDate.getDay().toString());
        // Check if the new value has been modified before inserting it into the Observable stream
        if (secondsFirstDigit !== this.oldSecondsFirst) {
            this.oldSecondsFirst = secondsFirstDigit;
            this.secondsFirstDigitSubject.next(secondsFirstDigit);
        }
        if (secondsSecondDigit !== this.oldSecondsSecond) {
            this.oldSecondsSecond = secondsSecondDigit;
            this.secondsSecondDigitSubject.next(secondsSecondDigit);
        }
        if (minutesFirstDigit !== this.oldMinutesFirst) {
            this.oldMinutesFirst = minutesFirstDigit;
            this.minutesFirstDigitSubject.next(minutesFirstDigit);
        }
        if (minutesSecondDigit !== this.oldMinutesSecond) {
            this.oldMinutesSecond = minutesSecondDigit;
            this.minutesSecondDigitSubject.next(minutesSecondDigit);
        }
        if (hoursFirstDigit !== this.oldHoursFirst) {
            this.oldHoursFirst = hoursFirstDigit;
            this.hoursFirstDigitSubject.next(hoursFirstDigit);
        }
        if (hoursSecondDigit !== this.oldHoursSecond) {
            this.oldHoursSecond = hoursSecondDigit;
            this.hoursSecondDigitSubject.next(hoursSecondDigit);
        }
        if (date !== this.oldDate) {
            this.oldDate = date;
            this.dateSubject.next(date);
        }
        if (month !== this.oldMonth) {
            this.oldMonth = month;
            this.monthSubject.next(month);
        }
        if (year !== this.oldYear) {
            this.oldYear = year;
            this.yearSubject.next(year);
        }
        if (day !== this.oldDay) {
            this.oldDay = day;
            this.daySubject.next(day);
        }
    };
    // Getters to use externally to retrieve clock data
    ClockService.prototype.getSecondsFirstDigit = function () {
        return this.secondsFirstDigitSubject.asObservable();
    };
    ClockService.prototype.getSecondsSecondDigit = function () {
        return this.secondsSecondDigitSubject.asObservable();
    };
    ClockService.prototype.getMinutesFirstDigit = function () {
        return this.minutesFirstDigitSubject.asObservable();
    };
    ClockService.prototype.getMinutesSecondDigit = function () {
        return this.minutesSecondDigitSubject.asObservable();
    };
    ClockService.prototype.getHoursFirstDigit = function () {
        return this.hoursFirstDigitSubject.asObservable();
    };
    ClockService.prototype.getHoursSecondDigit = function () {
        return this.hoursSecondDigitSubject.asObservable();
    };
    ClockService.prototype.getDate = function () {
        return this.dateSubject.asObservable();
    };
    ClockService.prototype.getMonth = function () {
        return this.monthSubject.asObservable();
    };
    ClockService.prototype.getYear = function () {
        return this.yearSubject.asObservable();
    };
    ClockService.prototype.getDay = function () {
        return this.daySubject.asObservable();
    };
    // used to transform the day of the week number into human readable weekdays.
    ClockService.prototype.translateDayToLanguage = function (dayNr) {
        return this.daysOfWeek.days[Number(dayNr) - 1]; // new Date() returns a day number starting from 1.
    };
    ClockService.prototype.correctLength = function (digits) {
        if (digits.length <= 1) {
            return '0' + digits;
        }
        else {
            return digits;
        }
    };
    ClockService.prototype.resetClock = function () {
        this.secondsFirstDigitSubject.next(this.oldSecondsFirst);
        this.secondsSecondDigitSubject.next(this.oldSecondsSecond);
        this.minutesFirstDigitSubject.next(this.oldMinutesFirst);
        this.minutesSecondDigitSubject.next(this.oldMinutesSecond);
        this.hoursFirstDigitSubject.next(this.oldHoursFirst);
        this.hoursSecondDigitSubject.next(this.oldHoursSecond);
        this.dateSubject.next(this.oldDate);
        this.monthSubject.next(this.oldMonth);
        this.yearSubject.next(this.oldYear);
        this.daySubject.next(this.oldDay);
    };
    return ClockService;
}());
ClockService = __decorate([
    core_1.Injectable()
], ClockService);
exports.ClockService = ClockService;
