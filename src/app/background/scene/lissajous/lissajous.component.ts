import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-lissajous',
  templateUrl: './lissajous.component.html',
  styleUrls: ['./lissajous.component.css']
})
export class LissajousComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private spacing: number = 60;
  private columns: number;
  private rows: number;

  private counter: number = 0;
  private frequency: number = 0.005;
  private amplitude: number;

  private gridValues: number[][][] = [];
  // [xPos, yPos, xCenterPos, yCenterPos, sinMultiplier, cosMultiplier, previousXPos, previousYPos]

  constructor(private fpsService: FpsService, private colorService: ColorService) {
  }

  ngOnInit() {
    this.spacing = this.screenWidth / 61;
    this.amplitude = (this.spacing * 9 / 10) / 2;
    this.running = true;
    this.setup();
    this.fpsService.getFps().takeUntil(this.ngUnsubscribe).subscribe(value => {
      this.fpsValues = value;
    });
    requestAnimationFrame(() => this.paint());
  }

  ngOnDestroy() {
    this.running = false;
    this.fpsService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private paint(): void {
    // Check that we're still running.
    if (!this.running) {
      return;
    }
    this.updateGrid();
    this.fpsService.updateFps();
    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {

        ctx.strokeStyle = this.gradient2;
        ctx.lineWidth = this.screenHeight/400;
        ctx.beginPath();
        // draw line from previousPos to newPos
        ctx.moveTo(this.gridValues[i][j][6], this.gridValues[i][j][7]);
        ctx.lineTo(this.gridValues[i][j][0], this.gridValues[i][j][1]);
        ctx.closePath();
        ctx.stroke();

        //Draw them as dots:
        //ctx.fillStyle = '#ffffff';
        //ctx.strokeStyle = 'rgba(0,0,0,0)';
        //ctx.beginPath();
        //ctx.ellipse(this.gridValues[i][j][0], this.gridValues[i][j][1], 1, 1,0, 0 ,Math.PI*2);
        //ctx.closePath();
        //ctx.fill();


      }
    }
    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.3));
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.3));

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());

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

  private updateGrid(): void {
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
