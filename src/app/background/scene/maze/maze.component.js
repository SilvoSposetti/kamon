"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var MazeComponent = (function () {
    function MazeComponent() {
        this.spacing = 10;
        this.sectors = [];
        this.counter = 0;
    }
    MazeComponent.prototype.ngOnInit = function () {
        this.running = true;
        this.initSectors();
        this.paint();
    };
    MazeComponent.prototype.ngOnDestroy = function () {
        this.running = false;
    };
    MazeComponent.prototype.paint = function () {
        var _this = this;
        if (!this.running) {
            return;
        }
        var ctx = this.canvasRef.nativeElement.getContext('2d');
        ctx.stroke();
        //for (let k = 0; k < this.columns; k++) {
        for (var k = 0; k < 50; k++) {
            var i = this.counter % this.columns;
            var j = Math.floor(this.counter / this.columns);
            var x = this.sectors[i][j][0];
            var y = this.sectors[i][j][1];
            // Paint current frame
            var random = Math.random();
            if (random < 0.25) {
                ctx.beginPath();
                ctx.strokeStyle = '#ffffff';
                ctx.moveTo(x, y);
                ctx.lineTo(x + this.spacing, y + this.spacing);
                ctx.stroke();
            }
            else if (random < 0.9) {
                ctx.beginPath();
                ctx.strokeStyle = '#ffffff';
                ctx.moveTo(x + this.spacing, y);
                ctx.lineTo(x, y + this.spacing);
                ctx.stroke();
            }
            else {
            }
            this.counter++;
        }
        if (this.counter >= this.nrOfElements) {
            this.running = false;
        }
        //Schedule next
        requestAnimationFrame(function () { return _this.paint(); });
    };
    MazeComponent.prototype.initSectors = function () {
        this.columns = Math.ceil(this.screenWidth / this.spacing);
        this.rows = Math.ceil(this.screenHeight / this.spacing);
        console.log(this.screenWidth, this.screenHeight, this.columns, this.rows);
        this.nrOfElements = this.rows * this.columns;
        for (var i = 0; i < this.columns; ++i) {
            this.sectors.push([]);
            for (var j = 0; j < this.rows; ++j) {
                var x = this.spacing * i;
                var y = this.spacing * j;
                this.sectors[i].push([x, y]);
            }
        }
    };
    return MazeComponent;
}());
__decorate([
    core_1.ViewChild('myCanvas')
], MazeComponent.prototype, "canvasRef");
__decorate([
    core_1.Input()
], MazeComponent.prototype, "screenWidth");
__decorate([
    core_1.Input()
], MazeComponent.prototype, "screenHeight");
MazeComponent = __decorate([
    core_1.Component({
        selector: 'app-maze',
        templateUrl: './maze.component.html',
        styleUrls: ['./maze.component.css']
    })
], MazeComponent);
exports.MazeComponent = MazeComponent;
