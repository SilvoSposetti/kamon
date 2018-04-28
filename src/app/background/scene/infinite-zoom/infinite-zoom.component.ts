import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-infinite-zoom',
  templateUrl: './infinite-zoom.component.html',
  styleUrls: ['./infinite-zoom.component.css']
})
export class InfiniteZoomComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private timeToLiveIncrement: number = 0.008;
  private speedExponent: number = 3;

  // Stars:
  private numOfStars: number = 1000;
  private stars: number[][] = [];
  private starsLineWidth: number = 3;
  private starsCenterDistance: number = 10;
  // [posX, posY, oldX, oldY, angle, colorCounter, timeAlive]

  // Squares:
  private numOfSquaresPerLayer: number = 10;
  private numOfLayers: number = 10; // Must be an even number!
  private squares: number [][] = [];
  private squaresLineWidth: number = 2;
  private angleIncrement: number = Math.PI / 4000;

  // for each layer: [timeAlive, sideLength, rotationAngle1, rotationAngle2, ...,]


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  public setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createRadialGradient(0, 0, 0, this.screenWidth / 2, this.screenHeight / 2, Math.sqrt(Math.pow(this.screenWidth / 2, 2) + Math.pow(this.screenHeight / 2, 2)));
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));

    this.gradient2 = ctx.createRadialGradient(0, 0, 0, this.screenWidth / 2, this.screenHeight / 2, Math.sqrt(Math.pow(this.screenWidth / 2, 2) + Math.pow(this.screenHeight / 2, 2)));
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());


    let diagonal: number = Math.sqrt(Math.pow(this.screenWidth, 2) + Math.pow(this.screenHeight, 2));
    // This value is used as "spacing" between timeLived by square's layers:
    let squaresTimeToLiveDifference: number = this.sizeToTime(diagonal) / this.numOfLayers;
    // This is used so that stars don't start "out of the screen"
    let starsMaxStartTimeLived: number = this.sizeToTime(Math.min(this.screenWidth / 2, this.screenHeight / 2));

    // STARS.
    for (let i = 0; i < this.numOfStars; i++) {
      let angle = Math.random() * 2 * Math.PI;
      let timeToLive = Math.random() * starsMaxStartTimeLived;
      let distance = this.timeToSize(timeToLive);
      let posX = this.screenWidth / 2 + Math.sin(angle) * distance;
      let posY = this.screenHeight / 2 + Math.cos(angle) * distance;
      this.stars.push([posX, posY, posX, posY, angle, 0, timeToLive]);
    }

    // SQUARES:
    for (let i = 0; i < this.numOfLayers; i++) {
      let layer: number[] = [];
      layer.push(squaresTimeToLiveDifference * (i + 1)); // Layer's timeAlive.
      layer.push(this.timeToSize((squaresTimeToLiveDifference * (i + 1)))); // Layer's size.
      for (let j = 0; j < this.numOfSquaresPerLayer; j++) {
        layer.push((Math.PI / 2 / this.numOfSquaresPerLayer) * j);
      }
      this.squares.push(layer);
    }
  }

  /*********************************************************************************************************************
   * UPDATE
   ********************************************************************************************************************/
  public update(): void{
    this.updateSquares();
    this.updateStars();
  }

  private updateStars(): void {
    // [posX, posY, oldX, oldY, angle, colorCounter, timeAlive]
    for (let i = 0; i < this.numOfStars; i++) {
      let distanceFromCenter = Math.sqrt(Math.pow(this.stars[i][2] - this.screenWidth / 2, 2) + Math.pow(this.stars[i][3] - this.screenHeight / 2, 2));
      if (distanceFromCenter <= this.starsCenterDistance) {
        distanceFromCenter = this.starsCenterDistance;
      }
      //Update old position:
      this.stars[i][2] = this.stars[i][0];
      this.stars[i][3] = this.stars[i][1];
      // Update timeLived and decide new position accordingly:
      this.stars[i][6] += this.timeToLiveIncrement;
      this.stars[i][0] = this.screenWidth / 2 + this.timeToSize(this.stars[i][6]) * Math.sin(this.stars[i][4]);
      this.stars[i][1] = this.screenHeight / 2 + this.timeToSize(this.stars[i][6]) * Math.cos(this.stars[i][4]);

      // Update star color:
      this.stars[i][5] = Math.floor((Math.abs(Math.sin((distanceFromCenter - this.starsCenterDistance) / 10)) * 256 % 256)); // Updates color value

      // Boundary Checking:
      if (this.stars[i][2] > this.screenWidth || this.stars[i][2] < 0 || this.stars[i][3] < 0 || this.stars[i][3] > this.screenHeight) {
        this.stars[i][0] = this.screenWidth / 2;
        this.stars[i][1] = this.screenHeight / 2;
        this.stars[i][2] = this.screenWidth / 2;
        this.stars[i][3] = this.screenHeight / 2;
        this.stars[i][4] = Math.random() * Math.PI * 2;
        this.stars[i][5] = 0;
        this.stars[i][6] = 0;
      }
    }
  }

  private updateSquares(): void {
    // for each layer: [timeAlive, sideLength, rotationAngle1, rotationAngle2, ...]
    let halfDiagonal = Math.sqrt(Math.pow(this.screenWidth, 2) + Math.pow(this.screenHeight, 2));
    for (let i = 0; i < this.numOfLayers; i++) {
      for (let j = 2; j < this.numOfSquaresPerLayer + 2; j++) {
        // ROTATE:
        if (i % 2 == 0) {
          this.squares[i][j] += this.angleIncrement;
        }
        else {
          this.squares[i][j] -= this.angleIncrement;
        }
      }

      // INCREASE SIZE:
      this.squares[i][0] += this.timeToLiveIncrement;
      this.squares[i][1] = this.timeToSize(this.squares[i][0]);
      // Boundary Checking:
      // When the square's side is bigger than half the diagonal of the screeen, then recycle it in the middle.
      // (By setting its timeLived to 0;
      if (this.squares[i][1] >= halfDiagonal) {
        this.squares[i][0] = 0;
      }
    }
  }

  /*********************************************************************************************************************
   * DRAW
   ********************************************************************************************************************/
  public draw(): void {
    this.drawBackground();
    this.drawStars();
    this.drawSquares();
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

  }



  private drawStars(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.lineWidth = this.starsLineWidth;
    for (let i = 0; i < this.numOfStars; i++) {
      ctx.strokeStyle = this.gradient2;
      ctx.beginPath();
      ctx.moveTo(this.stars[i][2], this.stars[i][3]);
      ctx.lineTo(this.stars[i][0], this.stars[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  private drawSquares(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    for (let i = 0; i < this.numOfLayers; i++) {
      for (let j = 2; j < this.numOfSquaresPerLayer + 2; j++) {

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
        ctx.rect(-this.squares[i][1] / 2, -this.squares[i][1] / 2, this.squares[i][1], this.squares[i][1]);

        ctx.strokeStyle = this.gradient2;
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

  // Helper function that transform a unit of "timeLived" into the "distance" at which an element should be at that time
  private timeToSize(time: number): number {
    return Math.pow(time, this.speedExponent);
  }

  // Helper function that transform a unit of "distance" into a "timeLived" at which an element should be at that time
  private sizeToTime(size: number): number {
    return Math.pow(size, 1 / this.speedExponent);
  }
}
