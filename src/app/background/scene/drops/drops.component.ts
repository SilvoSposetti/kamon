import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-drops',
  templateUrl: './drops.component.html',
  styleUrls: ['./drops.component.css']
})
export class DropsComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;
  // Scene variables:
  private running: boolean;
  private numOfDrops: number = 30;
  private drops: number[][] = [];
  // Each drop has: [centerX, centerY, radius, timeLived, ageOfDeath, nrOfWaves]
  private radiusIncrement: number = 2;
  private minAgeOfDeath: number = 10;
  private maxAgeOfDeath: number = 80;
  private ageIncrement: number = 1;
  private waveLength: number = 50;
  private maxLineWidth: number = 20;


  constructor(private fpsService: FpsService, private colorService: ColorService) {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    this.fpsService.getFps().takeUntil(this.ngUnsubscribe).subscribe(value => {
      this.fpsValues = value;
    });
    requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    this.running = false;
    this.fpsService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopHEX());
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopHEX());

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());

    for (let i = 0; i < this.numOfDrops; i++) {
      this.drops.push(this.newDrop());
    }
  }

  private loop(): void {
    this.fpsService.updateFps();

    // Paint background:
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    this.update();

    this.paint();


    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }

  private update(): void {
    for (let i = 0; i < this.numOfDrops; i++) {
      this.drops[i][3] += this.ageIncrement;
      if (this.drops[i][3] >= 0) {
        this.drops[i][2] += this.radiusIncrement;
      }
      if (this.drops[i][3] >= this.drops[i][4]) { // timeLived has surpassed ageOfDeath.
        this.resetDrop(i);
      }
    }
  }

  private paint(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.gradient2;
    for (let i = 0; i < this.numOfDrops; i++) {
      for (let j = 0; j <= this.drops[i][5]; j++) {
        let r = this.drops[i][2] - (j * this.waveLength);
        ctx.lineWidth = (-this.maxLineWidth / this.drops[i][4]) * (this.drops[i][3] - this.drops[i][4]);
        if (r > 0) {
          ctx.beginPath();
          ctx.arc(this.drops[i][0], this.drops[i][1], r, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }


  private newDrop(): number[] {
    let posX = Math.random() * this.screenWidth;
    let posY = Math.random() * this.screenHeight;
    let timeLived = Math.random() * -100;
    let ageOfDeath = Math.random() * (this.maxAgeOfDeath - this.minAgeOfDeath) + this.minAgeOfDeath;
    let nrOfWaves = Math.ceil(this.radiusIncrement * ageOfDeath / this.waveLength);
    return [posX, posY, 0, timeLived, ageOfDeath, nrOfWaves];
  }

  private resetDrop(dropIndex: number): void {
    this.drops[dropIndex][0] = Math.random() * this.screenWidth;
    this.drops[dropIndex][1] = Math.random() * this.screenHeight;
    this.drops[dropIndex][2] = 0;
    this.drops[dropIndex][3] = Math.random() * -100;
    this.drops[dropIndex][4] = Math.random() * (this.maxAgeOfDeath - this.minAgeOfDeath) + this.minAgeOfDeath;
    this.drops[dropIndex][5] = Math.ceil(this.radiusIncrement * this.drops[dropIndex][4] / this.waveLength);
  }


}
