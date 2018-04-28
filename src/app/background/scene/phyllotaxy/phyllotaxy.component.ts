import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-phyllotaxy',
  templateUrl: './phyllotaxy.component.html',
  styleUrls: ['./phyllotaxy.component.css']
})
export class PhyllotaxyComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private points: number[][] = [];
  // [x,y,size]
  private nrOfPoints: number = 6000;
  private counter: number = 0;
  private colorCounter: number = 0;
  private elementsPerFrame = 1;
  private c = 22;

  private alphaGradient: CanvasGradient;

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  public draw(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = this.alphaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    ctx.strokeStyle = this.sandGradient;
    for (let i = 0; i < Math.floor(this.elementsPerFrame) && this.counter < this.nrOfPoints; i++) {
      ctx.beginPath();
      let color = Math.floor(this.colorCounter * 0.2) % 100;
      if (color < 17) {
        color = 17;
      }
      ctx.fillStyle = this.sandGradient;

      ctx.arc(this.points[this.counter][0], this.points[this.counter][1], this.points[this.counter][2], 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      this.counter++;
      this.colorCounter++;
    }
    this.elementsPerFrame += 0.1;
  }

  public update(): void {
    if (this.counter >= this.nrOfPoints) {
      this.counter = 0;
      this.elementsPerFrame = 0;
    }
  }

  public setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.alphaGradient = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.alphaGradient.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.alphaGradient.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));


    let goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.nrOfPoints; i++) {
      let r = this.c * Math.sqrt(i) - this.c;
      let x = this.screenWidth / 2 + r * Math.cos(i * goldenAngle);
      let y = this.screenHeight / 2 + r * Math.sin(i * goldenAngle);
      let size = 20 - i * 0.004;
      if (size < 2) {
        size = 2;
      }
      this.points.push([x, y, size]);
    }
  }
}
