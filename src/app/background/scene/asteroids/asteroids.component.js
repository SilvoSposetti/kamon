"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var AsteroidsComponent = (function () {
    function AsteroidsComponent() {
        this.asteroids = [];
        // [posX,posY,velX,velY,mass]
        this.massInCenter = 10;
        this.gravConst = 100;
        this.nrOfElements = 1000;
        this.counter = 0;
    }
    AsteroidsComponent.prototype.ngOnInit = function () {
        this.startAsteroids();
        this.running = true;
        this.paint();
    };
    AsteroidsComponent.prototype.ngOnDestroy = function () {
        this.running = false;
    };
    AsteroidsComponent.prototype.paint = function () {
        var _this = this;
        // Check that we're still running.
        if (!this.running) {
            return;
        }
        // Paint current frame
        var ctx = this.canvasRef.nativeElement.getContext('2d');
        ////Draw background (which also effectively clears any previous drawing)
        //let grd = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
        //grd.addColorStop(0, '10afa3');
        //grd.addColorStop(0.25, '10998e');
        //grd.addColorStop(0.5, '177181');
        //grd.addColorStop(0.75, '1b5978');
        //grd.addColorStop(1, '1b4564');
        //ctx.fillStyle = grd;
        ctx.fillStyle = 'rgba(25,25,25,0.05)';
        ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.screenWidth / 2, this.screenHeight / 2, 30, 0, 2 * Math.PI);
        ctx.stroke();
        this.updateAsteroids();
        ctx.fillStyle = 'rgb(255,255,255)';
        for (var i = 0; i < this.nrOfElements; ++i) {
            ctx.beginPath();
            ctx.save();
            ctx.fillRect(this.asteroids[i][0], this.asteroids[i][1], 2, 2);
            ctx.restore();
        }
        // Schedule next
        requestAnimationFrame(function () { return _this.paint(); });
    };
    AsteroidsComponent.prototype.startAsteroids = function () {
        for (var i = 0; i < this.nrOfElements; ++i) {
            var element = [];
            var randomAngle = this.randomFloat(0, 2 * Math.PI);
            var x = this.screenWidth / 2 - this.randomFloat(100, 450) * Math.cos(randomAngle);
            var y = this.screenHeight / 2 - this.randomFloat(100, 450) * Math.sin(randomAngle);
            var randomAngleTurned = randomAngle + Math.PI / 2;
            element.push(x);
            element.push(y);
            element.push(1.7 * Math.cos(randomAngleTurned));
            element.push(1.7 * Math.sin(randomAngleTurned));
            element.push(Math.random() * 5);
            this.asteroids.push(element);
        }
    };
    AsteroidsComponent.prototype.updateAsteroids = function () {
        for (var i = 0; i < this.nrOfElements; ++i) {
            var vectorToCenterX = this.screenWidth / 2 - this.asteroids[i][0];
            var vectorToCenterY = this.screenHeight / 2 - this.asteroids[i][1];
            var distanceSquared = Math.pow(vectorToCenterX, 2) + Math.pow(vectorToCenterY, 2);
            if (distanceSquared <= 10000) {
                distanceSquared = 10000;
            }
            var force = this.gravConst * this.massInCenter * this.asteroids[i][4] / distanceSquared;
            var vectorToCenterLength = Math.sqrt(Math.pow(vectorToCenterX, 2) + Math.pow(vectorToCenterY, 2));
            vectorToCenterX /= vectorToCenterLength;
            vectorToCenterY /= vectorToCenterLength;
            this.asteroids[i][2] += force * vectorToCenterX / this.asteroids[i][4];
            this.asteroids[i][3] += force * vectorToCenterY / this.asteroids[i][4];
            this.asteroids[i][0] += this.asteroids[i][2];
            this.asteroids[i][1] += this.asteroids[i][3];
        }
    };
    AsteroidsComponent.prototype.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    AsteroidsComponent.prototype.randomFloat = function (min, max) {
        return Math.random() * (max - min + 1) + min;
    };
    return AsteroidsComponent;
}());
__decorate([
    core_1.ViewChild('myCanvas')
], AsteroidsComponent.prototype, "canvasRef");
__decorate([
    core_1.Input()
], AsteroidsComponent.prototype, "screenWidth");
__decorate([
    core_1.Input()
], AsteroidsComponent.prototype, "screenHeight");
AsteroidsComponent = __decorate([
    core_1.Component({
        selector: 'app-asteroids',
        templateUrl: './asteroids.component.html',
        styleUrls: ['./asteroids.component.css']
    })
], AsteroidsComponent);
exports.AsteroidsComponent = AsteroidsComponent;
//ctx.beginPath();
//ctx.save();
//ctx.restore();
