import {Component, Input} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-asteroids',
  templateUrl: './asteroids.component.html',
  styleUrls: ['./asteroids.component.css']
})
export class AsteroidsComponent extends Scene {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private asteroids: number[][] = [];
  // [posX,posY,velX,velY,mass,previousXPos,previousYPos]
  private massInCenter = 10;
  private gravityConstant = 100;
  private nrOfElements = 600;

  private seaGradientAlpha: CanvasGradient;


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  public setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.seaGradientAlpha = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.seaGradientAlpha.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.seaGradientAlpha.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));


    for (let i = 0; i < this.nrOfElements; ++i) {
      let element: number[] = [];
      let randomAngle = this.randomFloat(0, 2 * Math.PI);
      let x = this.screenWidth / 2 - this.randomFloat(100, this.screenWidth / 2) * Math.cos(randomAngle);
      let y = this.screenHeight / 2 - this.randomFloat(100, this.screenWidth / 2) * Math.sin(randomAngle);
      let randomAngleTurned = randomAngle + Math.PI / 2;
      element.push(x);
      element.push(y);
      let distanceFromCenterX = this.screenWidth / 2 - x;
      let distanceFromCenterY = this.screenHeight / 2 - y;
      let distance = Math.sqrt(Math.pow(distanceFromCenterX, 2) + Math.pow(distanceFromCenterY, 2));
      element.push(Math.sqrt((this.gravityConstant * this.massInCenter) / distance) * Math.cos(randomAngleTurned));
      element.push(Math.sqrt((this.gravityConstant * this.massInCenter) / distance) * Math.sin(randomAngleTurned));
      element.push(100);
      element.push(x);
      element.push(y);
      this.asteroids.push(element);

    }
  }

  public draw(): void {

    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = this.seaGradientAlpha;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    ctx.strokeStyle = this.sandGradient;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(this.screenWidth / 2, this.screenHeight / 2, 30, 0, 2 * Math.PI);
    ctx.stroke();

    for (let i = 0; i < this.nrOfElements; ++i) {

      ctx.lineWidth = 2;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.asteroids[i][5], this.asteroids[i][6]);
      ctx.lineTo(this.asteroids[i][0], this.asteroids[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  public update(): void {
    for (let i = 0; i < this.nrOfElements; ++i) {
      let vectorToCenterX = this.screenWidth / 2 - this.asteroids[i][0];
      let vectorToCenterY = this.screenHeight / 2 - this.asteroids[i][1];
      let distanceSquared = Math.pow(vectorToCenterX, 2) + Math.pow(vectorToCenterY, 2);
      if (distanceSquared <= 10000) {
        distanceSquared = 10000;
      }
      let force = this.gravityConstant * this.massInCenter * this.asteroids[i][4] / distanceSquared;

      let vectorToCenterLength = Math.sqrt(Math.pow(vectorToCenterX, 2) + Math.pow(vectorToCenterY, 2));
      vectorToCenterX /= vectorToCenterLength;
      vectorToCenterY /= vectorToCenterLength;
      this.asteroids[i][5] = this.asteroids[i][0];
      this.asteroids[i][6] = this.asteroids[i][1];
      this.asteroids[i][2] += force * vectorToCenterX / this.asteroids[i][4];
      this.asteroids[i][3] += force * vectorToCenterY / this.asteroids[i][4];
      this.asteroids[i][0] += this.asteroids[i][2];
      this.asteroids[i][1] += this.asteroids[i][3];

    }
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
  }
}
