import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-lissajous',
  templateUrl: './lissajous.component.html',
  styleUrls: ['./lissajous.component.css']
})
export class LissajousComponent implements OnInit, OnDestroy {

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

  private spacing: number = 60;
  private columns: number;
  private rows: number;

  private counter: number = 0;
  private frequency: number = 0.005;
  private amplitude: number;

  private gridValues: number[][][] = [];

  // [xPos, yPos, xCenterPos, yCenterPos, sinMultiplier, cosMultiplier, previousXPos, previousYPos]

  ngOnInit() {
    this.spacing = this.screenWidth/61;
    this.amplitude = (this.spacing * 9 / 10) / 2;
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

    this.updateGrid();

    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {

        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 2;
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
