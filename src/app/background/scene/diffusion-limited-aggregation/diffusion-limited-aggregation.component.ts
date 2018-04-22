import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-diffusion-limited-aggregation',
  templateUrl: './diffusion-limited-aggregation.component.html',
  styleUrls: ['./diffusion-limited-aggregation.component.css']
})
export class DiffusionLimitedAggregationComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private numOfWalkers: number = 20;
  private walkers: number[][] = [];
  private tree: number[][] = [];
  // Each element of the tree/walker has: [posX, posY, radius]
  private drawBackgroundOnce: boolean = true;
  private maxIntersectionsPerFrame: number = this.numOfWalkers;
  private amountOfCircles: number = 0;
  private maxRadius: number = 25;
  private spawnRadius: number = 40;


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

  private loop(): void {
    if (this.drawBackgroundOnce) {
      let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
      //ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillStyle = this.gradient1;
      ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
      this.drawBackgroundOnce = false;
      this.drawCircle();
    }

    this.fpsService.updateFps();

    this.update();

    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }

  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopHEX());
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopHEX());

    this.gradient2 = ctx.createRadialGradient(this.screenWidth / 2, this.screenHeight / 2, 0, this.screenWidth / 2, this.screenHeight / 2, Math.sqrt(Math.pow(this.screenWidth / 2, 2) + Math.pow(this.screenWidth / 2, 2)));
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());

    // Setup walkers list:
    for (let i = 0; i < this.numOfWalkers; i++) {
      this.walkers.push([]);
    }
    for (let i = 0; i < this.numOfWalkers; i++) {
      this.resetWalker(i);
    }
    // First element in the tree:
    this.tree.push([this.screenWidth / 2, this.screenHeight / 2, this.newRadiusSize()]);
  }

  private update() {
    this.WalkersTreeIntersections();
    this.moveWalkers();
    //this.drawWalkers();
  }


  private drawCircle() {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    //ctx.strokeStyle = '#ffffff';
    //ctx.lineWidth = 2;

    let numberBaseTen = -0.5 * this.amountOfCircles + 255 - 30;
    numberBaseTen = 255 - Math.floor(numberBaseTen);
    if (numberBaseTen >= 255) {
      numberBaseTen = 255;
    }
    //this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    //this.gradient2.addColorStop(0, this.colorService.mapForegroundGradientSaturationFirstStop(numberBaseTen));
    //this.gradient2.addColorStop(1, this.colorService.mapForegroundGradientSaturationSecondStop());
    ctx.fillStyle = this.gradient2;
    ctx.beginPath();
    ctx.arc(this.tree[this.tree.length - 1][0], this.tree[this.tree.length - 1][1], this.tree[this.tree.length - 1][2], 0, 2 * Math.PI);
    ctx.closePath();
    //ctx.stroke();
    ctx.fill();
  }

  private drawWalkers(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < this.walkers.length; i++) {
      ctx.beginPath();
      ctx.arc(this.walkers[i][0], this.walkers[i][1], this.walkers[i][2], 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }


  private resetWalker(index: number): void {
    let rndAngle = Math.random() * 2 * Math.PI;
    //let radius = Math.sqrt(Math.pow(this.screenWidth / 2, 2) + Math.pow(this.screenHeight / 2, 2));
    let allowedRadius = Math.random() * 300 + this.spawnRadius;
    let x = this.screenWidth / 2 + allowedRadius * Math.cos(rndAngle);
    let y = this.screenHeight / 2 + allowedRadius * Math.sin(rndAngle);
    this.walkers[index] = [x, y, this.newRadiusSize()];
    this.amountOfCircles++;
  }

  private moveWalkers(): void {
    for (let i = 0; i < this.walkers.length; i++) {
      let stepSize = -0.02 * this.amountOfCircles + 5;
      if (stepSize < 1) {
        stepSize = 1;
      }
      this.walkers[i][0] += Math.random() * stepSize * 2 - stepSize;
      this.walkers[i][1] += Math.random() * stepSize * 2 - stepSize;

      // introduce a force that pushes towards the first element of the tree, to speed up initial phase:
      let vX = this.tree[0][0] - this.walkers[i][0];
      let vY = this.tree[0][1] - this.walkers[i][1];
      let length = Math.sqrt(vX * vX + vY * vY);
      vX /= length;
      vY /= length;
      // force becomes weaker as the amount of elements in the tree increases
      this.walkers[i][0] += 0.01 * vX * this.walkers[i][2] * this.numOfWalkers;
      this.walkers[i][1] += 0.01 * vY * this.walkers[i][2] * this.numOfWalkers;

    }

  }

  private WalkersTreeIntersections(): void {
    let intersectionCounter = 0;
    for (let i = 0; i < this.tree.length; i++) {
      for (let j = 0; j < this.walkers.length; j++) {
        let distance = Math.pow(this.tree[i][0] - this.walkers[j][0], 2) + Math.pow(this.tree[i][1] - this.walkers[j][1], 2);
        if (distance < Math.pow(this.tree[i][2] + this.walkers[j][2], 2)) {
          this.tree.push(this.walkers[j]);

          intersectionCounter++;
          let distanceFromFirstElement = Math.sqrt(Math.pow(this.walkers[j][0] - this.tree[0][0], 2) + Math.pow(this.walkers[j][1] - this.tree[0][1], 2));
          if (distanceFromFirstElement >= this.spawnRadius) {
            this.spawnRadius = distanceFromFirstElement;
          }
          this.resetWalker(j);
          this.drawCircle();
        }
      }
    }
    if (intersectionCounter >= this.maxIntersectionsPerFrame) {
      this.running = false;
      console.log('finished');
    }

  }

  private newRadiusSize(): number {
    let value = -0.025 * this.amountOfCircles + this.maxRadius;
    if (value < 4) {
      value = 4;
    }
    return value;
  }

  //private hexColour(): string {
  //
  //  return this.colorService.mapSecondGradientSaturation(numberBaseTen);
  //
  //}
}


