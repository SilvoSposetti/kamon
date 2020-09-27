import {Component, Input} from '@angular/core';
import {Scene} from '../../../shared/models/Scene';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-refraction',
  templateUrl: './refraction.component.html',
  styleUrls: ['./refraction.component.css']
})
export class RefractionComponent extends Scene {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private offScreenCanvas = document.createElement('canvas');


  private spectrum: number[] = [380, 780];

  private numOfLayers: number = 20;
  private layers: number[][] = [];
  private layerWidth: number;
  //each layer contains: [startX, finishX, n]  n = refraction index for blue light
  // (the index of refraction for red light is smaller than the one for blue: 1 < n(lambdaRed) < n(lambdaYellow < n(lambdaBlue))


  private numOfRays: number = 50;
  private rays: number[][][] = [];
  private wavelengths: number[] = [];
  private colors: string[] = [];
  //each ray has a part for each time it reflects/refracts , where each section has[startX, startY, endX, endY, angle, nextDirection, nextLayerIndex].
  // direction is 1 if goes forward, -1 if goes backwards.

  private lineWidth: number = 1;
  private raysStartMaxAngle = 0.1;
  private maxBounces = 25;
  private speed = 1000;

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  public setup(): void {
    // Setup layers

    this.offScreenCanvas.width = this.screenWidth;
    this.offScreenCanvas.height = this.screenHeight;

    this.layerWidth = this.screenWidth / this.numOfLayers;
    for (let i = 0; i < this.numOfLayers; i++) {
      //this.layers.push([this.layerWidth * i, this.layerWidth * (i + 1), 1 + Math.random(), 1]);
      this.layers.push([this.layerWidth * i, this.layerWidth * (i + 1), 1 + 1 - i / this.numOfLayers, 1]);
      //this.layers.push([this.layerWidth * i, this.layerWidth * (i + 1), 1 + i / this.numOfLayers, 1]);
    }

    // Setup rays:
    for (let i = 0; i < this.numOfRays; i++) {
      this.rays.push([]);
      let wavelength = this.spectrum[0] + (this.spectrum[1] - this.spectrum[0]) * (i + 1) / this.numOfRays;
      this.wavelengths.push(wavelength);
      this.colors.push(this.colorService.getRGBAFromWavelength(wavelength));
      for (let j = 0; j < this.maxBounces; j++) { // capped at 2 times the amount of layers because a ray can maximally go forward and backward through all layers
        this.rays[i].push(this.nullRay());
      }
    }
  }

  public update(): void {
    this.updateRaysStart();
    this.updateRaysThroughLayers();
  }

  private updateRaysStart(): void {
    let angle = this.raysStartMaxAngle * Math.sin(-this.frameCount / this.speed);
    let startY = this.screenHeight / 2 + this.screenHeight / 2 * Math.sin(this.frameCount / this.speed);
    let startX = 0;
    let endX = this.layerWidth;
    let endY = startY + this.layerWidth * Math.tan(angle);

    //Bounce check:
    let criticalAngle = Math.asin(this.layers[1][2] / this.layers[0][2]);
    let direction = 1;
    let nextLayer = 1;
    if (Math.abs(angle) >= Math.abs(criticalAngle)) {
      direction = -1;
      nextLayer = 0;
    }
    for (let i = 0; i < this.numOfRays; i++) {
      this.rays[i][0] = [startX, startY, endX, endY, angle, direction, nextLayer];
    }
  }

  private updateRaysThroughLayers(): void {
    // Simple draw without total internal reflection:
    //for (let i = 0; i < this.numOfRays; i++) {
    //  for (let j = 1; j < this.numOfLayers; j++) {
    //    if (this.rays[i][j - 1][1] >= 0 && this.rays[i][j - 1][1] <= this.screenHeight) {
    //      // start:
    //      let startX = this.rays[i][j - 1][2];
    //      let startY = this.rays[i][j - 1][3];
    //
    //      //end:
    //      let n1 = this.layers[j - 1][2];
    //      let n2 = this.layers[j][2];
    //      let refractionCoefficient = ((n1 / n2) / this.spectrum[1]) * this.wavelengths[i];
    //      let angle = Math.asin(refractionCoefficient * Math.sin(this.rays[i][j - 1][4]));
    //      let endX = (j + 1) * this.layerWidth;
    //      let endY = this.rays[i][j - 1][3] + this.layerWidth * Math.tan(angle);
    //
    //      this.rays[i][j] = [startX, startY, endX, endY, angle];
    //    }
    //  }
    //}

    for (let i = 0; i < this.numOfRays; i++) {
      let j = 1; //counts the sections of the ray
      while (j < this.maxBounces) {
        if (this.startIsOutsideScreen(i, j)) {
          while (j < this.maxBounces) {
            this.rays[i][j] = this.nullRay();
            j++;
          }
          break;
        }
        let currentLayer = this.rays[i][j - 1][6];

        if (this.layers[currentLayer - 1] === undefined || this.layers[currentLayer] === undefined) {
          break;
        }

        if (this.rays[i][j - 1][5] === 1) { // Moves FORWARD!
          let direction = 1;

          let startX = this.rays[i][j - 1][2];
          let startY = this.rays[i][j - 1][3];

          let n1 = this.layers[currentLayer - 1][2];
          let n2 = this.layers[currentLayer][2];
          let refractionCoefficient = ((n1 / n2) * this.spectrum[1]) / this.wavelengths[i];
          let angle = Math.asin(refractionCoefficient * Math.sin(this.rays[i][j - 1][4]));

          let nextLayer = currentLayer + 1;

          if (Number.isNaN(angle)) {
            direction = -1;
            angle = this.rays[i][j - 1][4];
            nextLayer = currentLayer;
          }

          let endX = (currentLayer + direction) * this.layerWidth;
          let endY = this.rays[i][j - 1][3] + this.layerWidth * Math.tan(angle);

          this.rays[i][j] = [startX, startY, endX, endY, angle, direction, nextLayer];
        }

        else { // Moves BACKWARDS!
          let direction = -1;

          let startX = this.rays[i][j - 1][2];
          let startY = this.rays[i][j - 1][3];

          let n1 = this.layers[currentLayer][2];
          let n2 = this.layers[currentLayer - 1][2];
          let refractionCoefficient = ((n1 / n2) * this.spectrum[1]) / this.wavelengths[i];
          let angle = Math.asin(refractionCoefficient * Math.sin(this.rays[i][j - 1][4]));
          let nextLayer = currentLayer - 1;

          if (Number.isNaN(angle)) {
            direction = 1;
            angle = this.rays[i][j - 1][4];
            nextLayer = currentLayer;
          }

          let endX = (currentLayer - 1 + direction) * this.layerWidth;
          let endY = this.rays[i][j - 1][3] + this.layerWidth * Math.tan(angle);

          this.rays[i][j] = [startX, startY, endX, endY, angle, direction, nextLayer];
        }
        j++;
      }
    }
  }

  private startIsOutsideScreen(rayIndex: number, bounceIndex: number): boolean {
    return this.rays[rayIndex][bounceIndex - 1][2] < 0 // startX is too small
      || this.rays[rayIndex][bounceIndex - 1][2] > this.screenWidth // startX is too big
      || this.rays[rayIndex][bounceIndex - 1][3] < 0 // startY is too small
      || this.rays[rayIndex][bounceIndex - 1][3] > this.screenHeight; // startY is too big

  }

  public draw(): void {
    this.drawBackground();
    this.drawLayers();
    this.drawRays();
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawLayers(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    for (let i = 0; i < this.numOfLayers; i++) {
      ctx.fillStyle = this.colorService.getForegroundFirstStopRGBA(2 - this.layers[i][2]);
      ctx.fillRect(this.layers[i][0], 0, this.layerWidth, this.screenHeight);
    }
  }

  private drawRays(): void {
    // First draw on off-screen context with additive blending mode
    let offScreenCtx: CanvasRenderingContext2D = this.offScreenCanvas.getContext('2d');
    offScreenCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    offScreenCtx.lineWidth = this.lineWidth;
    offScreenCtx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.numOfRays; i++) {
      offScreenCtx.strokeStyle = this.colors[i];
      for (let j = 0; j < this.maxBounces; j++) {
          offScreenCtx.beginPath();
          offScreenCtx.moveTo(this.rays[i][j][0], this.rays[i][j][1]);
          offScreenCtx.lineTo(this.rays[i][j][2], this.rays[i][j][3]);
          offScreenCtx.closePath();
          offScreenCtx.stroke();
      }
    }
    // Then draw result on original canvas:
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.drawImage(this.offScreenCanvas, 0, 0);
  }

  private nullRay(): number[] {
    return [-1, -1, -1, -1, -1, 1, -1];
  }
}

