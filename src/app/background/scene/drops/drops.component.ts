import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

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


  // FPS variables:
  public fps = 0;
  private now: number;
  private lastUpdate = new Date().getTime();
  public frameFps = 0;
  // The higher this value, the less the FPS will be affected by quick changes
  // Setting this to 1 will show the FPS of the last sampled frame only
  public fpsFilter = 50;
  private fpsCounter = 0;
  private fpsMean = 60;
  public fpsMeanFloored = -1;
  private framesToWaitBeforeMean: number = 10;

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


  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    this.running = false;
  }

  private setup(): void {
    for (let i = 0; i < this.numOfDrops; i++) {
      this.drops.push(this.newDrop());
    }
  }

  private loop(): void {
    this.updateFps();

    // Paint background:
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    //ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillStyle = 'rgba(0,0,0,1)';
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
    ctx.strokeStyle = '#aaaaaa';
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

  private updateFps(): void {
    this.now = new Date().getTime();
    this.frameFps = 1000 / (this.now - this.lastUpdate);
    if (this.now != this.lastUpdate) {
      this.fps += (this.frameFps - this.fps) / this.fpsFilter;
      this.frameFps = Math.ceil(this.frameFps);
      this.lastUpdate = this.now;
      if (this.fpsCounter >= this.framesToWaitBeforeMean) {
        // Update average:
        this.fpsMean = ((this.fpsMean * this.fpsCounter) + this.frameFps) / (this.fpsCounter + 1);
        this.fpsMeanFloored = Math.floor(this.fpsMean);
      }
      this.fpsCounter++;
    }
  }

}
