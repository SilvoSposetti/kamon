"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var PhyllotaxyComponent = (function () {
    function PhyllotaxyComponent() {
        this.points = [];
        // [x,y,size]
        this.nrOfPoints = 6000;
        this.counter = 0;
        this.c = 20;
    }
    PhyllotaxyComponent.prototype.ngOnInit = function () {
        this.running = true;
        this.loadPoints();
        this.paint();
    };
    PhyllotaxyComponent.prototype.ngOnDestroy = function () {
        this.running = false;
    };
    PhyllotaxyComponent.prototype.paint = function () {
        var _this = this;
        // Check that we're still running.
        if (!this.running || this.counter >= this.nrOfPoints) {
            return;
        }
        // Paint current frame
        var ctx = this.canvasRef.nativeElement.getContext('2d');
        //ctx.fillStyle = 'rgba(25,25,25,0.05)';
        //ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
        for (var i = 0; i < 10; i++) {
            ctx.beginPath();
            var color = Math.floor(this.counter * 0.2) % 100;
            if (color < 17) {
                color = 17;
            }
            ctx.fillStyle = '#' + color.toString(16) + color.toString(16) + color.toString(16);
            ctx.arc(this.points[this.counter][0], this.points[this.counter][1], this.points[this.counter][2], 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            this.counter++;
        }
        // Schedule next
        requestAnimationFrame(function () { return _this.paint(); });
    };
    PhyllotaxyComponent.prototype.loadPoints = function () {
        var goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (var i = 0; i < this.nrOfPoints; i++) {
            var r = this.c * Math.sqrt(i) - 2 * this.c;
            var x = this.screenWidth / 2 + r * Math.cos(i * goldenAngle);
            var y = this.screenHeight / 2 + r * Math.sin(i * goldenAngle);
            var size = 20;
            this.points.push([x, y, size]);
        }
    };
    return PhyllotaxyComponent;
}());
__decorate([
    core_1.ViewChild('myCanvas')
], PhyllotaxyComponent.prototype, "canvasRef");
__decorate([
    core_1.Input()
], PhyllotaxyComponent.prototype, "screenWidth");
__decorate([
    core_1.Input()
], PhyllotaxyComponent.prototype, "screenHeight");
PhyllotaxyComponent = __decorate([
    core_1.Component({
        selector: 'app-phyllotaxy',
        templateUrl: './phyllotaxy.component.html',
        styleUrls: ['./phyllotaxy.component.css']
    })
], PhyllotaxyComponent);
exports.PhyllotaxyComponent = PhyllotaxyComponent;
