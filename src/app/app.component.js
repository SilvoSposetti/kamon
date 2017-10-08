"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent(configService, searchService) {
        this.configService = configService;
        this.searchService = searchService;
        //private altKeyAction: boolean;
        this.showList = this.configService.getConfig().showList;
        this.selectionSuggestion = -1;
        this.showSceneSelector = false;
        this.showClock = this.configService.getConfig().showClock;
        this.showFuckOff = this.configService.getConfig().showFuckOff;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.listenForSelection();
    };
    // listens and deals with function calling and propagation of keypresses.
    AppComponent.prototype.keyboardInput = function (event) {
        if (event.ctrlKey) {
            // do not stopPropagation and preventDefault because it is needed for Ctrl+Shift+i (open browser console)
            this.showList = !this.showList;
        }
        else if (event.which === 27) {
            event.preventDefault();
            event.stopPropagation();
            console.log('escape');
            this.searchService.resetSearchString();
        }
        else if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();
            console.log('enter');
            this.searchService.launchSearch(this.selectionSuggestion);
        }
        else if (event.which === 37 || event.which === 38) {
            event.preventDefault();
            event.stopPropagation();
            console.log('arrowLeft');
            this.searchService.selectLeft();
        }
        else if (event.which === 39 || event.which === 40) {
            event.preventDefault();
            event.stopPropagation();
            console.log('arrowRight');
            this.searchService.selectRight();
        }
        else if (event.which === 36) {
            event.preventDefault();
            event.stopPropagation();
            console.log('home');
            this.showSceneSelector = !this.showSceneSelector;
        }
        else if (event.which === 35) {
            event.preventDefault();
            event.stopPropagation();
            console.log('end');
            this.showClock = !this.showClock;
        }
        //this.keyboardEvent = event;
        //console.log(this.keyboardEvent);
        // EXAMPLES:
        //this.altKey = event.altKey;
        //this.charCode = event.charCode;
        //this.code = event.code;
        //this.ctrlKey = event.ctrlKey;
        //this.keyCode = event.keyCode;
        //this.keyIdentifier = event.keyIdentifier;
        //this.metaKey = event.metaKey;
        //this.shiftKey = event.shiftKey;
        //this.timeStamp = event.timeStamp;
        //this.type = event.type;
        //this.which = event.which;
    };
    AppComponent.prototype.listenForSelection = function () {
        var _this = this;
        this.selectionSubscription = this.searchService.getSelection().subscribe(function (value) {
            return _this.selectionSuggestion = value;
        });
    };
    return AppComponent;
}());
__decorate([
    core_1.HostListener('window:keydown', ['$event'])
], AppComponent.prototype, "keyboardInput");
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
exports.AppComponent = AppComponent;
