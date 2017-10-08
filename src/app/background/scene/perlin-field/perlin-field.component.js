"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var PerlinFieldComponent = (function () {
    function PerlinFieldComponent(fastSimplexNoise) {
        this.fastSimplexNoise = fastSimplexNoise;
        this.fps = 0;
        this.lastUpdate = new Date().getTime();
        this.frameFps = 0;
        // The higher this value, the less the FPS will be affected by quick changes
        // Setting this to 1 will show you the FPS of the last sampled frame only
        this.fpsFilter = 100;
        // import and declaration of noise function
        //
        this.spacing = 20;
        var noise = new this.fastSimplexNoise({ frequency: 0.1, min: 0, max: 1, octaves: 8 });
    }
    PerlinFieldComponent.prototype.ngOnInit = function () {
        this.running = true;
        this.setup();
        this.paint();
        console.log(this.noise.scaled([0, 1]));
    };
    PerlinFieldComponent.prototype.ngOnDestroy = function () {
        this.running = false;
    };
    PerlinFieldComponent.prototype.paint = function () {
        var _this = this;
        // Check that we're still running.
        if (!this.running) {
            return;
        }
        // Calculates fps
        this.now = new Date().getTime();
        this.frameFps = 1000 / (this.now - this.lastUpdate);
        if (this.now != this.lastUpdate) {
            this.fps += (this.frameFps - this.fps) / this.fpsFilter;
            this.fps = Math.ceil(this.fps);
            this.lastUpdate = this.now;
        }
        // Paint current frame
        var ctx = this.canvasRef.nativeElement.getContext('2d');
        var yoff = 0;
        for (var y = 0; y < this.rows; y++) {
            var xoff = 0;
            for (var x = 0; x < this.columns; x++) {
                ctx.fillStyle = '#ffffff';
                ctx.rect(x * this.spacing, y * this.spacing, 10, 10);
            }
        }
        // Schedule next
        requestAnimationFrame(function () { return _this.paint(); });
    };
    PerlinFieldComponent.prototype.setup = function () {
        this.columns = Math.ceil(this.screenWidth / this.spacing);
        this.rows = Math.ceil(this.screenHeight / this.spacing);
    };
    return PerlinFieldComponent;
}());
__decorate([
    core_1.ViewChild('myCanvas')
], PerlinFieldComponent.prototype, "canvasRef");
__decorate([
    core_1.Input()
], PerlinFieldComponent.prototype, "screenWidth");
__decorate([
    core_1.Input()
], PerlinFieldComponent.prototype, "screenHeight");
PerlinFieldComponent = __decorate([
    core_1.Component({
        selector: 'app-perlin-field',
        templateUrl: './perlin-field.component.html',
        styleUrls: ['./perlin-field.component.css']
    })
], PerlinFieldComponent);
exports.PerlinFieldComponent = PerlinFieldComponent;
