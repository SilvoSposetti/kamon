import {Component, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {Scene} from '../../../shared/models/Scene';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.css']
})
export class ParallaxComponent extends Scene implements AfterViewInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  // First element is the farthest away, last element is the nearest
  private direction: number = -1; // -1 to send elements to the left, +1 to send elements to the right
  private timeIncrement: number = 0.1;
  private numOfElements: number = 200;
  private elements: number[][] = []; // contains [height, position, size, speed, timeToBeBorn]
  private sizeFactor: number = 0.2;
  private speedFactor: number = 0.005;
  private maxTimeToBeBorn: number = 2;
  private topMargin: number = 10;


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngAfterViewInit() {
    this.initialiseCore();
  }

  ngOnDestroy(): void {
    this.terminateCore();
  }

  /*****************************************************************************************************************************************
   * SETUP */
  public setup(): void {
    for (let i = 0; i < this.numOfElements; i++) {
      let height = Math.pow(i / this.numOfElements, 2) * (this.screenHeight - this.topMargin) + this.topMargin;
      let position = Math.random() * this.screenWidth;
      let timeToBeBorn = 0;
      this.elements.push([height, position, this.getSize(height), this.getSpeed(height), timeToBeBorn]);
    }
  }

  /*****************************************************************************************************************************************
   * UPDATE */
  public update(): void {
    for (let i = 0; i < this.numOfElements; i++) {

      if (this.elements[i][4] <= 0) {
        this.elements[i][1] += this.direction * this.elements[i][3];
      }
      else {
        this.elements[i][4] -= this.timeIncrement;
      }

      if (this.elements[i][1] <= -this.elements[i][2]) {
        this.elements[i][1] = this.screenWidth + this.elements[i][2];
        this.elements[i][4] = Math.random() * this.maxTimeToBeBorn;
      }
    }
  }

  /*****************************************************************************************************************************************
   * DRAW */
  public draw(): void {
    this.drawBackground();
    this.drawCircles();

  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawCircles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;

    for (let i = 0; i < this.numOfElements; i++) {
      ctx.lineWidth = Math.ceil(0.1 * this.elements[i][2]);
      ctx.beginPath();
      ctx.arc(this.elements[i][1], this.elements[i][0], this.elements[i][2], 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    }
    ctx.stroke();
  }

  /*****************************************************************************************************************************************
   * OTHER */

  private getSize(height: number): number {
    return this.sizeFactor * height;
  }

  private getSpeed(height: number): number {
    return this.speedFactor * height;
  }

}




