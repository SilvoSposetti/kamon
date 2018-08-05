import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Scene} from "../../../shared/models/Scene";
import {FpsService} from "../../../shared/services/fps.service";
import {ColorService} from "../../../shared/services/color.service";

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.css']
})
export class ParallaxComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  // First element is the farthest away, last element is the nearest
  private time: number = 0;
  private direction: number = -1; // -1 to send elements to the left, +1 to send elements to the right
  private timeIncrement: number = 0.1;
  private layerDistance: number = 5;
  private numOfLayers: number = 10;
  private elements: number[][] = []; // contains [distance, position, size, speed, height, timeToBeBorn]
  private sizeFactor: number = 10;
  private speedFactor: number = 10;
  private heightFactor: number = 10;
  private maxTimeToBeBorn: number = 10;


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
    for (let i = 0; i < this.numOfLayers; i++) {
      let distance = this.layerDistance * i;
      let position = distance * Math.random() * this.screenWidth;
      let timeToBeBorn = 0;
      this.elements.push([distance, position, this.getSize(distance), this.getSpeed(distance), this.getHeight(distance), timeToBeBorn]);
    }
  }

  /*****************************************************************************************************************************************
   * UPDATE */
  public update(): void {
    for (let i = 0; i < this.numOfLayers; i++) {
      this.elements[i][1] += this.direction * this.elements[i][3];

      if(this.elements[i][5] === 0 && (this.elements[i][1] <= 0 || this.elements[i][1] >= this.screenWidth)){
        // this.
      }

    }

    this.time += this.timeIncrement;
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
{}
  private drawCircles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;
    // ctx.fillStyle = this.seaGradient;
    let centerX = this.screenWidth / 2;
    let centerY = this.screenHeight / 2;
    for (let i = 0; i < this.numOfLayers; i++) {
      ctx.beginPath();
      ctx.arc(centerX + this.parallaxVector[0] * this.layers[i][0], centerY + this.parallaxVector[1] * this.layers[i][0], this.layers[i][1], 0, Math.PI * 2);
      ctx.closePath();
      // ctx.fill();
      ctx.stroke();

      // ctx.rect(centerX - this.layers[i][0]/2, centerY - this.layers[i][2], this.layers[i][0], this.layers[i][0]);
    }
    ctx.stroke();
  }

  /*****************************************************************************************************************************************
   * OTHER */

  private getSize(distance: number): number {
    return this.speedFactor * Math.pow(Math.E, distance);
  }

  private getSpeed(distance: number): number {
    return this.sizeFactor * Math.log(distance);
  }

  private getHeight(distance: number): number {
    return this.heightFactor * Math.log(distance);
  }

}




