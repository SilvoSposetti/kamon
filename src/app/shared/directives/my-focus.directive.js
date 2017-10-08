"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var MyFocusDirective = (function () {
    function MyFocusDirective(renderer) {
        this.renderer = renderer;
        this.autoFocus();
    }
    // Used to focus on #search-input input at application startup
    MyFocusDirective.prototype.autoFocus = function () {
        this.renderer.selectRootElement('#search-input').focus();
    };
    // Used to focus again on #search-input input when focus is lost on it.
    MyFocusDirective.prototype.onBlur = function () {
        this.autoFocus();
    };
    return MyFocusDirective;
}());
__decorate([
    core_1.Input('myFocus')
], MyFocusDirective.prototype, "isFocused");
__decorate([
    core_1.HostListener('blur')
], MyFocusDirective.prototype, "onBlur");
MyFocusDirective = __decorate([
    core_1.Directive({
        selector: '[myFocus]'
    })
], MyFocusDirective);
exports.MyFocusDirective = MyFocusDirective;
