import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Scene} from "../../../shared/models/Scene";
import {FpsService} from "../../../shared/services/fps.service";
import {ColorService} from "../../../shared/services/color.service";
import OpenSimplexNoise from 'open-simplex-noise';


@Component({
  selector: 'app-stacked-plot',
  templateUrl: './stacked-plot.component.html',
  styleUrls: ['./stacked-plot.component.css']
})
export class StackedPlotComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private lineWidth = 1;


  private numOfPoints: number = 40;
  private numOfLines = 30;
  private graphPoints: number[][] = [];
  private linesLeftAndRightPaddingRatio: number = 1 / 6;
  private linesLeftAndRightPadding: number;
  private maxElementHeight: number = 300;
  private noise = new OpenSimplexNoise(Date.now()); // Date.now() is the seed
  private noiseHorizontalScale = 0.3;
  private noiseVerticalScale = 10;

  private normalDistributionAmplitudes: number[] = [];

  private time = 0;
  private timeIncrement = 0.01;


  private linesSeparation: number;
  private pointsSeparation: number;
  private xPadding: number;
  private yPadding: number;
  private verticalSpacing: number;

  private previousScreenWidth;
  private previousScreenHeight;

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy(): void {
    this.terminateCore();
  }

  /*****************************************************************************************************************************************
   * SETUP */
  public setup(): void {

    for (let i = 0; i < this.numOfLines; i++) {
      let line: number[] = [];
      for (let j = 0; j < this.numOfPoints; j++) {
        // line.push(1);
        // line.push(0);
      }
      this.graphPoints.push(line);
    }

    for (let i = 0; i < this.numOfPoints; i++) {
      this.normalDistributionAmplitudes.push(1);
    }
  }


  /*****************************************************************************************************************************************
   * UPDATE */
  public update(): void {
    if (this.previousScreenWidth !== this.screenWidth || this.previousScreenHeight !== this.screenHeight) {
      this.updateVariables();
      this.previousScreenWidth = this.screenWidth;
      this.previousScreenHeight = this.screenHeight;
    }


    this.updatePointsGraph();

    // increase Time:
    this.time += this.timeIncrement;

  }

  private updateVariables(): void {
    // Update variables if screen size has changed:
    this.verticalSpacing = this.screenHeight / 30;


    this.linesSeparation = (this.screenHeight - 2 * this.verticalSpacing - this.maxElementHeight) / (this.numOfLines - 1);
    this.yPadding = this.maxElementHeight; // At least one line separation to be behind whole line below
    this.xPadding = 2 * this.lineWidth;


    this.linesLeftAndRightPadding = this.screenWidth * this.linesLeftAndRightPaddingRatio;
    this.pointsSeparation = (this.screenWidth - this.linesLeftAndRightPadding * 2) / (this.numOfPoints - 1);


    let sigma = 0.2;
    let mu = 0.5;
    for (let i = 0; i < this.numOfPoints; i++) {
      let x = i / this.numOfPoints;
      this.normalDistributionAmplitudes[i] = (1 / Math.sqrt(2 * Math.PI * sigma * sigma)) * Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma)) / 2;
    }
  }

  private updatePointsGraph(): void {
    for (let i = 0; i < this.numOfLines; i++) {
      for (let j = 0; j < this.numOfPoints; j++) {
        this.graphPoints[i][j] = (this.noise.noise2D((i + 1) * this.noiseVerticalScale + this.noiseHorizontalScale * (j + 1), this.time)) / 2 + 0.5;
      }
    }
  }

  /*****************************************************************************************************************************************
   * DRAW */
  public draw(): void {
    this.drawBackground();

    this.drawLines();

  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawLines(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.sandGradient;
    ctx.fillStyle = this.seaGradient;

    for (let i = 0; i < this.numOfLines; i++) {
      let baseHeight = this.linesSeparation * i + this.maxElementHeight + this.verticalSpacing;
      ctx.beginPath();
      ctx.moveTo(-this.xPadding, baseHeight);

      for (let j = 0; j < this.numOfPoints; j++) {
        ctx.lineTo(this.linesLeftAndRightPadding + this.pointsSeparation * j, baseHeight - this.graphPoints[i][j] * this.maxElementHeight * this.normalDistributionAmplitudes[j]);
      }

      // Close line element:
      ctx.lineTo(this.screenWidth + this.xPadding, baseHeight);
      ctx.lineTo(this.screenWidth + this.xPadding, baseHeight + this.yPadding);
      ctx.lineTo(-this.xPadding, baseHeight + this.yPadding);
      // ctx.lineTo(-this.xPadding, baseHeight);
      ctx.closePath();

      // And paint:
      ctx.fill();
      ctx.stroke();
    }
  }

  /*****************************************************************************************************************************************
   * OTHER */

}
