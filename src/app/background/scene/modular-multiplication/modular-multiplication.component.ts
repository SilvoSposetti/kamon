import {Component, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-modular-multiplication',
  templateUrl: './modular-multiplication.component.html',
  styleUrls: ['./modular-multiplication.component.css']
})
export class ModularMultiplicationComponent extends Scene implements AfterViewInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  private circlesLineWidth: number = 1;
  private amountOfNormalRadiiInTheScreenWidth: number = 30; // Defines normalRadius!
  private normalRadius: number;
  private rhombusSectors: number [][][] = [];
  private numOfColumns: number; // Initialized later and based on normalRadius
  private numOfRows: number; // Initialized later and based on normalRadius
  private rowsHeight: number; // Initialized later and based on normalRadius
  private columnsWidth: number; // Initialized later and based on normalRadius
  // each sector contains circles, each circle has [centerX, centerY]

  private bigRadius: number;
  private bigCircles: number[][] = [];
  // each big circle contains: [centerX, centerY]

  private smallRadius: number;
  private smallCircles: number[][] = [];


  private lines: number[][] = [];
  private lineWidth: number = 2;
  // each line contains [fromX, fromY, toX, toY]


  private counter: number = 0;
  private counterIncrement: number = 1;
  private nextCounter: number = 0;
  private nextCounterIncrement: number = -(1 + Math.sqrt(5)) / 2;
  private startAngle = Math.PI / 2;
  //private startAngle = 0;

  private normalCirclePoints = 1000;
  private bigCirclePoints = 1000;
  private smallCirclePoints = 1000;

  private alphaGradient: CanvasGradient;


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngAfterViewInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  /*********************************************************************************************************************
   * COMPUTATIONS
   ********************************************************************************************************************/


  public setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.alphaGradient= ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.alphaGradient.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.alphaGradient.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));

    this.normalRadius = this.screenWidth / this.amountOfNormalRadiiInTheScreenWidth;

    this.rowsHeight = this.normalRadius * 3 * (1 + Math.sqrt(3));
    this.columnsWidth = this.rowsHeight / Math.sqrt(3);

    this.bigRadius = this.normalRadius * (2 + Math.sqrt(3) / 2);
    this.smallRadius = this.normalRadius / 3;

    this.numOfRows = Math.ceil(this.screenHeight / this.rowsHeight) + 1;
    this.numOfColumns = Math.ceil(this.screenWidth / this.columnsWidth) + 1;
    let columnsWidthRest = this.columnsWidth * this.numOfColumns - this.screenWidth;
    let rowsHeightRest = this.rowsHeight * this.numOfRows - this.screenHeight;

    // Considering parts of the sections as top-left, top-right, bottom-left, bottom-right, with 3 circles per part:
    let a = this.normalRadius * 2; // x-distance of second circle
    let b = this.normalRadius * (1 + Math.sqrt(3)); // y-distance of second circle
    let c = this.normalRadius * (1 + 2 * Math.sqrt(3)); // y-distance of third circle

    for (let i = 0; i < this.numOfColumns; i++) {
      for (let j = 0; j < this.numOfRows; j++) {
        let sector: number  [][] = [];
        let centerX = i * this.columnsWidth - columnsWidthRest / 2;
        let centerY = j * this.rowsHeight - rowsHeightRest / 2;
        if (Math.pow(-1, i + j) === -1) {
          // TOP-LEFT:
          sector.push([centerX + this.normalRadius, centerY - this.normalRadius]);
          sector.push([centerX + a, centerY - b]);
          sector.push([centerX + this.normalRadius, centerY - c]);
          // TOP-RIGHT:
          sector.push([centerX - this.normalRadius, centerY - this.normalRadius]);
          sector.push([centerX - a, centerY - b]);
          sector.push([centerX - this.normalRadius, centerY - c]);
          // BOTTOM-LEFT:
          sector.push([centerX - this.normalRadius, centerY + this.normalRadius]);
          sector.push([centerX - a, centerY + b]);
          sector.push([centerX - this.normalRadius, centerY + c]);
          // BOTTOM-RIGHT:
          sector.push([centerX + this.normalRadius, centerY + this.normalRadius]);
          sector.push([centerX + a, centerY + b]);
          sector.push([centerX + this.normalRadius, centerY + c]);
          this.rhombusSectors.push(sector);

          // Small1 bottom:
          this.smallCircles.push([centerX + this.smallRadius * 2, centerY + b]);
          this.smallCircles.push([centerX, centerY + b + this.smallRadius * 2]);
          this.smallCircles.push([centerX - this.smallRadius * 2, centerY + b]);
          this.smallCircles.push([centerX, centerY + b - this.smallRadius * 2]);
          // Small1 top:
          this.smallCircles.push([centerX + this.smallRadius * 2, centerY - b]);
          this.smallCircles.push([centerX, centerY - b + this.smallRadius * 2]);
          this.smallCircles.push([centerX - this.smallRadius * 2, centerY - b]);
          this.smallCircles.push([centerX, centerY - b - this.smallRadius * 2]);
        }
        else {
          this.bigCircles.push([centerX, centerY]);
        }

      }
    }
  }


  public update(): void {
    this.lines = []; // Reset lines to draw because old ones have been drawn the frame before.

    let fromX: number = 0;
    let fromY: number = 0;
    let toX: number = 0;
    let toY: number = 0;

    // Normal Circles:
    for (let i = 0; i < this.rhombusSectors.length; i++) {
      for (let j = 0; j < 12; j++) {
        fromX = this.rhombusSectors[i][j][0] + this.normalRadius * Math.cos(this.startAngle + Math.pow(-1, j) * (2 * Math.PI / this.normalCirclePoints) * (this.counter % this.normalCirclePoints));
        fromY = this.rhombusSectors[i][j][1] + this.normalRadius * Math.sin(this.startAngle + Math.pow(-1, j) * (2 * Math.PI / this.normalCirclePoints) * (this.counter % this.normalCirclePoints));
        toX = this.rhombusSectors[i][j][0] + this.normalRadius * Math.cos(this.startAngle + Math.pow(-1, j) * (2 * Math.PI / this.normalCirclePoints) * (this.nextCounter % this.normalCirclePoints));
        toY = this.rhombusSectors[i][j][1] + this.normalRadius * Math.sin(this.startAngle + Math.pow(-1, j) * (2 * Math.PI / this.normalCirclePoints) * (this.nextCounter % this.normalCirclePoints));
        this.lines.push([fromX, fromY, toX, toY]);
      }
    }

    //Big Circles First:
    for (let i = 0; i < this.bigCircles.length; i++) {
      fromX = this.bigCircles[i][0] + this.bigRadius * Math.cos(this.startAngle + Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.counter % this.bigCirclePoints));
      fromY = this.bigCircles[i][1] + this.bigRadius * Math.sin(this.startAngle + Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.counter % this.bigCirclePoints));
      toX = this.bigCircles[i][0] + this.bigRadius * Math.cos(this.startAngle + Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.nextCounter % this.bigCirclePoints));
      toY = this.bigCircles[i][1] + this.bigRadius * Math.sin(this.startAngle + Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.nextCounter % this.bigCirclePoints));
      this.lines.push([fromX, fromY, toX, toY]);
    }
    //Big Circles Second:
    for (let i = 0; i < this.bigCircles.length; i++) {
      fromX = this.bigCircles[i][0] + this.bigRadius * Math.cos(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.counter % this.bigCirclePoints));
      fromY = this.bigCircles[i][1] + this.bigRadius * Math.sin(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.counter % this.bigCirclePoints));
      toX = this.bigCircles[i][0] + this.bigRadius * Math.cos(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.nextCounter % this.bigCirclePoints));
      toY = this.bigCircles[i][1] + this.bigRadius * Math.sin(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.bigCirclePoints) * (this.nextCounter % this.bigCirclePoints));
      this.lines.push([fromX, fromY, toX, toY]);
    }

    // Small Circles:
    for (let i = 0; i < this.smallCircles.length; i++) {
      fromX = this.smallCircles[i][0] + this.smallRadius * Math.cos(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.smallCirclePoints) * (this.nextCounter % this.smallCirclePoints));
      fromY = this.smallCircles[i][1] + this.smallRadius * Math.sin(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.smallCirclePoints) * (this.nextCounter % this.smallCirclePoints));
      toX = this.smallCircles[i][0] + this.smallRadius * Math.cos(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.smallCirclePoints) * ((this.nextCounter + this.smallCirclePoints / 2) % this.smallCirclePoints));
      toY = this.smallCircles[i][1] + this.smallRadius * Math.sin(this.startAngle - Math.pow(-1, i) * (2 * Math.PI / this.smallCirclePoints) * ((this.nextCounter + this.smallCirclePoints / 2) % this.smallCirclePoints));
      this.lines.push([fromX, fromY, toX, toY]);
    }


    this.counter += this.counterIncrement;
    this.nextCounter += this.nextCounterIncrement;
  }

  /*********************************************************************************************************************
   * DRAW
   ********************************************************************************************************************/

  public draw(): void {
    // Paint background:
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.alphaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    this.drawLines();
  }



  private drawCircles(): void {

    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;
    ctx.lineWidth = this.circlesLineWidth;
    for (let i = 0; i < this.rhombusSectors.length; i++) {
      for (let j = 0; j < 12; j++) { // Don't change upper limit (12)! (Truncated hexagonal tiling is made up of sectors each having 12 circles)
        ctx.beginPath();
        ctx.arc(this.rhombusSectors[i][j][0], this.rhombusSectors[i][j][1], this.normalRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
      }
    }
    for (let i = 0; i < this.bigCircles.length; i++) {
      ctx.beginPath();
      ctx.arc(this.bigCircles[i][0], this.bigCircles[i][1], this.bigRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
    for (let i = 0; i < this.smallCircles.length; i++) {
      ctx.beginPath();
      ctx.arc(this.smallCircles[i][0], this.smallCircles[i][1], this.smallRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
  }


  private drawLines(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;
    ctx.lineWidth = this.lineWidth;
    for (let i = 0; i < this.lines.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.lines[i][0], this.lines[i][1]);
      ctx.lineTo(this.lines[i][2], this.lines[i][3]);
      ctx.closePath();
      ctx.stroke();
    }
  }
}
