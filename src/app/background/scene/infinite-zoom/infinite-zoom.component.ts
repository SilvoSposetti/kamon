import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-infinite-zoom',
  templateUrl: './infinite-zoom.component.html',
  styleUrls: ['./infinite-zoom.component.css']
})
export class InfiniteZoomComponent implements OnInit, OnDestroy {


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
  public fpsFilter = 10;


  // Stars:
  private numOfStars: number = 100;
  private stars: number[][] = [];
  private starsSpeedFactor: number = 0.01;
  private starsLineWidth: number = 3;
  private starsCenterDistance: number = 10;
  // [posX, posY, oldX, oldY, angle]

  // Squares:
  private numOfSquaresPerLayer: number = 1;
  private numOfLayers: number = 100; // Must be an even number!
  private squares: number [][] = [];
  private squaresLineWidth: number = 2;
  private angleIncrement: number = Math.PI / 500;
  private sizeIncrement: number = 0.01  ;

  // for each layer: [sideLength, rotationAngle1, rotationAngle2, ...]


  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    requestAnimationFrame(() => this.paint());
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


    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    //ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Update:
    this.updateStars();
    this.updateSquares();

    // Paint:
    this.paintStars();
    this.paintSquares();


    // Schedule next
    if (this.running) {
      requestAnimationFrame(() => this.paint());
    }
  }

  private setup(): void {
    // Stars.
    for (let i = 0; i < this.numOfStars; i++) {
      let posX = Math.random() * this.screenWidth;
      let posY = Math.random() * this.screenHeight;
      let vX = posX - this.screenWidth / 2;
      let vY = posY - this.screenHeight / 2;
      let angle = Math.atan(vY / vX);
      if (posX < this.screenWidth / 2) {
        angle += Math.PI;
      }
      this.stars.push([posX, posY, posX, posY, angle, 0]);
    }

    // Squares:
    let diagonal: number = Math.sqrt(Math.pow(this.screenWidth, 2) + Math.pow(this.screenHeight, 2));
    let firstElementSize = diagonal / this.numOfLayers;
    for (let i = 0; i < this.numOfLayers; i++) {
      let layer: number[] = [];
      let value = diagonal/2*Math.pow((1/this.numOfLayers)*(i),this.numOfLayers);
      //layer.push(firstElementSize + Math.pow(firstElementSize,(i+1)/this.numOfLayers)); // Layer's size.
      layer.push(value); // Layer's size.
      for (let j = 0; j < this.numOfSquaresPerLayer; j++) {
        layer.push((Math.PI * 2 / this.numOfSquaresPerLayer) * j);
      }
      this.squares.push(layer);
    }
  }

  /*********************************************************************************************************************
   * UPDATE
   ********************************************************************************************************************/
  private updateStars(): void {
    for (let i = 0; i < this.numOfStars; i++) {
      let d = Math.sqrt(Math.pow(this.stars[i][2] - this.screenWidth / 2, 2) + Math.pow(this.stars[i][3] - this.screenHeight / 2, 2));
      if (d <= this.starsCenterDistance) {
        d = this.starsCenterDistance;
      }
      this.stars[i][2] = this.stars[i][0];
      this.stars[i][3] = this.stars[i][1];
      this.stars[i][0] += this.starsSpeedFactor * Math.cos(this.stars[i][4]) * d;
      this.stars[i][1] += this.starsSpeedFactor * Math.sin(this.stars[i][4]) * d;

      this.stars[i][5] = Math.floor((Math.abs(Math.sin((d - this.starsCenterDistance) / 50)) * 256 % 256));

      if (this.stars[i][2] > this.screenWidth || this.stars[i][2] < 0 || this.stars[i][3] < 0 || this.stars[i][3] > this.screenHeight) {
        this.stars[i][0] = this.screenWidth / 2;
        this.stars[i][1] = this.screenHeight / 2;
        this.stars[i][2] = this.screenWidth / 2;
        this.stars[i][3] = this.screenHeight / 2;
        this.stars[i][4] = Math.random() * Math.PI * 2;
      }
    }
  }

  private updateSquares(): void {
    let halfDiagonal = Math.sqrt(Math.pow(this.screenWidth, 2) + Math.pow(this.screenHeight, 2));
    for (let i = 0; i < this.numOfLayers; i++) {
      for (let j = 1; j < this.numOfSquaresPerLayer + 1; j++) {
        // ROTATE:
        if (i % 2 == 0) {
          this.squares[i][j] += this.angleIncrement;
        }
        else {
          this.squares[i][j] -= this.angleIncrement;
        }

        }

      // INCREASE SIZE:
      let value = Math.sqrt(this.squares[i][0]/halfDiagonal*2);
      this.squares[i][0] += this.sizeIncrement * this.squares[i][0];
      if (this.squares[i][0] >= halfDiagonal) {
        this.squares[i][0] = 1;
      }
    }
  }

  /*********************************************************************************************************************
   * PAINT
   ********************************************************************************************************************/
  private paintStars(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.lineWidth = this.starsLineWidth;
    for (let i = 0; i < this.numOfStars; i++) {
      ctx.strokeStyle = this.toHexColour(this.stars[i][5]);
      //ctx.fillStyle = '#aaaaaa';
      //ctx.fillRect(this.stars[i][0], this.stars[i][1], 10, 10);
      ctx.beginPath();
      ctx.moveTo(this.stars[i][2], this.stars[i][3]);
      ctx.lineTo(this.stars[i][0], this.stars[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  private paintSquares(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    for (let i = 0; i < this.numOfLayers; i++) {
      for (let j = 1; j < this.numOfSquaresPerLayer + 1; j++) {
        // first save the untranslated/un-rotated context
        ctx.save();

        ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate(this.screenWidth / 2, this.screenHeight / 2);
        // rotate the rect
        ctx.rotate(this.squares[i][j]);

        // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn
        ctx.rect(-this.squares[i][0] / 2, -this.squares[i][0] / 2, this.squares[i][0], this.squares[i][0]);

        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = this.squaresLineWidth;
        ctx.stroke();
        // restore the context to its untranslated/un-rotated state
        ctx.restore();
      }
    }
  }

  /*********************************************************************************************************************
   * OTHER
   ********************************************************************************************************************/
  private toHexColour(numberBaseTen: number): string {
    let str = numberBaseTen.toString(16);
    if (str.length < 1) {
      str = '0' + str;
    }
    if (str.length < 2) {
      str = '0' + str;
    }
    return '#' + str + str + str;
  }
}
