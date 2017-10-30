import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {


  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;

  private running: boolean;

  public fps = 0;
  private now: number;
  private lastUpdate = new Date().getTime();
  public frameFps = 0;
  // The higher this value, the less the FPS will be affected by quick changes
  // Setting this to 1 will show you the FPS of the last sampled frame only
  public fpsFilter = 100;

  private functionValues: number[][];
  // [xPos, yPos, previousXPos, previousYPos]
  private numOfFunctions: number = 3;
  // sin, cos
  private rowHeight: number;
  private rowsCenter: number[] = [];
  private xForward: number = 2;

  private sinAngularVelocity: number = 0.01;
  private cosAngularVelocity: number = 0.01;

  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    this.paint();
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    // Check that we're still running.
    if (!this.running) {
      return;
    }
    // Calculates fps
    this.now = new Date().getTime();
    this.frameFps = 1000 / (this.now - this.lastUpdate);
    if (this.now != this.lastUpdate) {
      this.fps += (this.frameFps - this.fps) / this.fpsFilter;
      this.frameFps = Math.ceil(this.frameFps);
      this.lastUpdate = this.now;
    }

    // Update data
    this.update();

    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.005)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.numOfFunctions; i++) {
      //ctx.fillStyle = '#ffffff';
      ////ctx.strokeStyle = 'rgba(0,0,0,0)';
      //ctx.beginPath();
      //ctx.ellipse(this.functionValues[i][0], this.functionValues[i][1], 4, 4, 0, 0, Math.PI * 2);
      //ctx.fill();
      //ctx.closePath();

      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.functionValues[i][2], this.functionValues[i][3]);
      ctx.lineTo(this.functionValues[i][0], this.functionValues[i][1]);
      ctx.closePath();
      ctx.stroke();


    }


    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private setup(): void {
    this.rowHeight = this.screenHeight / this.numOfFunctions;
    this.functionValues = [];
    for (let i = 0; i < this.numOfFunctions; i++) {
      this.rowsCenter.push((i) * this.rowHeight + this.rowHeight / 2);
      this.functionValues.push([0, this.rowsCenter[i], 0, this.rowsCenter[i]]);

    }
  }

  private update(): void {
    for (let i = 0; i < this.numOfFunctions; i++) {
      if (this.functionValues[i][0] >= this.screenWidth) {
        this.functionValues[i][0] = 0;
      }
    }
    // Function 0: sin(x)
    this.functionValues[0][2] = this.functionValues[0][0];
    this.functionValues[0][3] = this.functionValues[0][1];
    this.functionValues[0][0] = this.functionValues[0][0] + this.xForward;
    this.functionValues[0][1] = this.rowsCenter[0] + this.rowHeight * 4 / 10 * Math.sin(this.functionValues[0][0] * this.sinAngularVelocity);
    // Function 1: cos(x)
    this.functionValues[1][2] = this.functionValues[1][0];
    this.functionValues[1][3] = this.functionValues[1][1];
    this.functionValues[1][0] += this.xForward;
    this.functionValues[1][1] = this.rowsCenter[1] + this.rowHeight * 4 / 10 * Math.cos(this.functionValues[1][0] * this.cosAngularVelocity);
    // Function 2:
    this.functionValues[2][2] = this.functionValues[2][0];
    this.functionValues[2][3] = this.functionValues[2][1];
    this.functionValues[2][0] += this.xForward;
    this.functionValues[2][1] = this.rowsCenter[2] + this.rowHeight * 2 / 10 * (Math.cos(this.functionValues[2][0] * this.cosAngularVelocity * 11) + Math.cos(this.functionValues[2][0] * this.cosAngularVelocity * 10));

    // Function 3:

    // Function 4:
  }
}

