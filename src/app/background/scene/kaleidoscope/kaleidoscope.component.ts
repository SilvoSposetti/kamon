import {Component, Input} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-kaleidoscope',
  templateUrl: './kaleidoscope.component.html',
  styleUrls: ['./kaleidoscope.component.css']
})
export class KaleidoscopeComponent extends Scene {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private numOfSlices: number = 20; // Must be bigger than 4.
  private sliceAngle: number;
  private offScreenCanvas = document.createElement('canvas');
  private offScreenWidth: number;
  private offScreenHeight: number;


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  public setup() {
    this.sliceAngle = Math.PI * 2 / this.numOfSlices;
    // Define off-screen canvas dimensions:
    this.offScreenWidth = Math.sqrt(Math.pow(this.screenWidth / 2, 2) + Math.pow(this.screenHeight / 2, 2));
    this.offScreenHeight = Math.sin(this.sliceAngle) * this.offScreenWidth;
    this.offScreenCanvas.width = this.offScreenWidth;
    this.offScreenCanvas.height = this.offScreenHeight;

    // Clip before drawing, so that it draws only on clipped part.
    let offScreenContext = this.offScreenCanvas.getContext('2d');
    offScreenContext.beginPath();
    offScreenContext.moveTo(0, 0);
    offScreenContext.lineTo(this.offScreenWidth, 0);
    offScreenContext.lineTo(this.offScreenWidth, Math.tan(this.sliceAngle) * this.offScreenWidth);
    offScreenContext.closePath();
    offScreenContext.clip();
  }

  private drawOnOffScreenCanvas(): void {
    let offScreenContext = this.offScreenCanvas.getContext('2d');
    // Draw canvas background:
    //offScreenContext.fillStyle = 'rgba(0,0,0,0.03)';
    offScreenContext.fillStyle = this.seaGradient;
    offScreenContext.fillRect(0, 0, this.offScreenWidth, this.offScreenHeight);

    // Draw slice borders:
    //offScreenContext.fillStyle = 'red';
    //offScreenContext.fillRect(0, 0, 1000, 2);
    // Draw on off-screen canvas:
    //offScreenContext.fillStyle = 'blue';
    //offScreenContext.fillRect(0, 10 + 10 * Math.cos(this.fpsCounter / 10), 600, 20);

    // Circles:
    let circlesDistance: number = 2;
    let firstCircleRadius: number = 10;
    for (let i = 0; i < 12; i++) {
      // Circles:
      this.kaleidoCircle(circlesDistance + firstCircleRadius * i, Math.pow(-1, i) * Math.cos(this.frameCount / 30), firstCircleRadius * (i + 1));
      // Squares:
      this.kaleidoRect(circlesDistance + firstCircleRadius * i, Math.pow(-1, i) * Math.cos(this.frameCount / 30), 10 * (i + 1), 10 * (i + 1), Math.pow(-1, i) * this.frameCount / 60 + Math.PI / 4);

      circlesDistance += 2 * firstCircleRadius * (i + 1);
    }
  }

  public update() {
  }

  public draw() {

    // No need to draw background on primary canvas because the slices cover it completely each frame.
    this.drawOnOffScreenCanvas();
    this.drawOffScreenCanvasOnCanvas();

  }

  private drawOffScreenCanvasOnCanvas() {
    // draw off-screen canvas on actual canvas
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    let angle = 0;
    ctx.translate(this.screenWidth / 2, this.screenHeight / 2);
    for (let i = 0; i < this.numOfSlices; i++) {
      ctx.save();
      // move to the center of the canvas
      // rotate the canvas to the specified degrees
      ctx.rotate(angle);
      // draw the image
      // since the context is rotated, the image will be rotated also
      ctx.drawImage(this.offScreenCanvas, 0, 0);
      // we’re done with the rotating so restore the un-rotated context
      ctx.restore();
      angle += this.sliceAngle;
    }
    ctx.translate(-this.screenWidth / 2, -this.screenHeight / 2);
  }

  // own implementation of where to draw rectangles on slices.
  private kaleidoRect(posR: number, posAngleRatio: number, width: number, height: number, rotation: number): void {
    // both 'pos' variables are used to locate the center of the rectangle
    // posR defines the distance from the center of the slice
    // posAngleRatio defines the position on the slice relative to slice dimension
    // (0 = middle of the slice, 1 = top of the slice, -1 = bottom of the slice)
    // width & height are the dimensions of the rect.
    // rotation defines rectangle rotation on its center
    let xFactor = Math.cos(this.sliceAngle * (1 + posAngleRatio) / 2);
    let yFactor = Math.sin(this.sliceAngle * (1 + posAngleRatio) / 2);
    let ctx = this.offScreenCanvas.getContext('2d');
    // first save the untranslated/un-rotated context
    ctx.save();
    // move the rotation point to the center of the rect
    ctx.translate((posR) * xFactor, (posR) * yFactor);
    // rotate the rect
    ctx.rotate(rotation + (this.sliceAngle / 2) * (1 + posAngleRatio));
    // draw the rect on the transformed context
    // after transforming [0,0] is visually [x,y], so the rect needs to be offset accordingly when drawn
    //ctx.beginPath();
    ctx.fillStyle = this.sandGradient;
    //ctx.strokeStyle = '#aaaaaa';
    //ctx.lineWidth = 5;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    //ctx.rect(-width / 2, -height / 2, width, height);
    //ctx.closePath();
    //ctx.stroke();
    // restore the context to its untranslated/un-rotated state
    ctx.restore();
  }

  // own implementation of where to draw a circle on a slice.
  private kaleidoCircle(posR: number, posAngleRatio: number, circleRadius: number): void {
    // posR defines the distance from the center of the slice
    // posAngleRatio defines the position on the slice relative to slice dimension
    // (0 = middle of the slice, 1 = top of the slice, -1 = bottom of the slice)
    // circleRadius defines the radius of the circle that needs to be drawn.
    let xFactor = Math.cos(this.sliceAngle * (1 + posAngleRatio) / 2);
    let yFactor = Math.sin(this.sliceAngle * (1 + posAngleRatio) / 2);
    let ctx = this.offScreenCanvas.getContext('2d');
    ctx.beginPath();
    //ctx.fillStyle = '#aaaaaa';
    ctx.strokeStyle = this.sandGradient;
    ctx.lineWidth = 5;
    ctx.arc(posR * xFactor, posR * yFactor, circleRadius, 0, 2 * Math.PI);
    //ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}
