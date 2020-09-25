import {Component, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-lissajous',
  templateUrl: './lissajous.component.html',
  styleUrls: ['./lissajous.component.css']
})
export class LissajousComponent extends Scene implements AfterViewInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private gradient1: CanvasGradient;

  private spacing: number = 60;
  private columns: number;
  private rows: number;

  private counter: number = 0;
  private frequency: number = 0.005;
  private amplitude: number;

  private gridValues: number[][][] = [];

  // [xPos, yPos, xCenterPos, yCenterPos, sinMultiplier, cosMultiplier, previousXPos, previousYPos]

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngAfterViewInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  public draw(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {

        ctx.strokeStyle = this.sandGradient;
        ctx.lineWidth = this.screenHeight / 400;
        ctx.beginPath();
        // draw line from previousPos to newPos
        ctx.moveTo(this.gridValues[i][j][6], this.gridValues[i][j][7]);
        ctx.lineTo(this.gridValues[i][j][0], this.gridValues[i][j][1]);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  public setup(): void {
    this.spacing = this.screenWidth / 61;
    this.amplitude = (this.spacing * 9 / 10) / 2;

    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));

    this.columns = Math.ceil(this.screenWidth / this.spacing);
    this.rows = Math.ceil(this.screenHeight / this.spacing);

    for (let i = 0; i < this.columns; i++) {
      this.gridValues.push([]);
      for (let j = 0; j < this.rows; j++) {
        this.gridValues[i].push(
          [i * this.spacing + this.spacing / 2,
            j * this.spacing + this.spacing / 2,
            i * this.spacing + this.spacing / 2,
            j * this.spacing + this.spacing / 2,
            -Math.floor(this.columns / 2) + i,
            -Math.floor(this.rows / 2) + j,
            i * this.spacing + this.spacing / 2,
            j * this.spacing + this.spacing / 2
          ]);
      }
    }
  }

  public update(): void {
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        let centerX = this.gridValues[i][j][2];
        let centerY = this.gridValues[i][j][3];
        let angularFrequencyX = this.gridValues[i][j][4];
        let angularFrequencyY = this.gridValues[i][j][5];
        this.gridValues[i][j][6] = this.gridValues[i][j][0];
        this.gridValues[i][j][7] = this.gridValues[i][j][1];
        this.gridValues[i][j][0] = centerX + this.amplitude * Math.sin(this.counter * this.frequency * angularFrequencyX);
        this.gridValues[i][j][1] = centerY + this.amplitude * Math.sin(this.counter * this.frequency * angularFrequencyY);
      }
    }
    this.counter++;
  }
}
