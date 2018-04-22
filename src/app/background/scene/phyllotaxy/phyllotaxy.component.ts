import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-phyllotaxy',
  templateUrl: './phyllotaxy.component.html',
  styleUrls: ['./phyllotaxy.component.css']
})
export class PhyllotaxyComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private points: number[][] = [];
  // [x,y,size]
  private nrOfPoints: number = 6000;
  private counter: number = 0;
  private colorCounter: number = 0;
  private elementsPerFrame = 1;
  private c = 20;

  constructor(private fpsService: FpsService, private colorService: ColorService) {
  }

  ngOnInit() {
    this.running = true;
    this.loadPoints();
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
    if (this.counter >= this.nrOfPoints) {
      this.counter = 0;
      this.elementsPerFrame = 1;
    }
    if (!this.running){
      //console.log('finished');
      return;
    }

    this.fpsService.updateFps();
    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    ctx.strokeStyle = this.gradient2;
    for (let i = 0; i < Math.floor(this.elementsPerFrame) && this.counter<this.nrOfPoints; i++) {
      ctx.beginPath();
      let color = Math.floor(this.colorCounter * 0.2) % 100;
      if (color < 17) {
        color = 17;
      }
      //ctx.fillStyle = '#' + color.toString(16) + color.toString(16) + color.toString(16); //TODO: add value color
      ctx.fillStyle = this.gradient2

      ctx.arc(this.points[this.counter][0], this.points[this.counter][1], this.points[this.counter][2], 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      this.counter++;
      this.colorCounter++;
    }
    this.elementsPerFrame += 0.1;
    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private loadPoints(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());

    let goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.nrOfPoints; i++) {
      let r = this.c * Math.sqrt(i) - this.c;
      let x = this.screenWidth / 2 + r * Math.cos(i * goldenAngle);
      let y = this.screenHeight / 2 + r * Math.sin(i * goldenAngle);
      let size = 20 - i*0.004;
      if (size<2){
        size = 2;
      }
      this.points.push([x, y, size]);
    }
  }
}
