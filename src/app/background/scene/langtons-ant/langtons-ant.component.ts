import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-langtons-ant',
  templateUrl: './langtons-ant.component.html',
  styleUrls: ['./langtons-ant.component.css']
})
export class LangtonsAntComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private columns: number = 101; // Best if it is an odd number;
  private rows: number;
  private cellSize: number;
  private grid: boolean[][] = [];
  private antPosition: number[] = []; // [posX, posY] in the grid
  private antDirection: number; // 0: up, 1: left, 2: down, 3: right
  private updateEachAmountOfFrame: number = 1;
  private amountOfUpdatesPerFrame: number = 5;
  private frameCount: number = 0;
  private frameDrawnCount: number = 0;

  // each element of the grid contains false for black and true for white.

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
    this.fpsService.updateFps();
    if (this.frameCount === 0) {
      this.drawBackground();
      // do update before draw so that the first 'setup' is not drawn.
      for (let i = 0; i < this.amountOfUpdatesPerFrame; i++) {
        this.update();
      }
      this.update();
      this.drawGrid();
      this.frameDrawnCount++;
    }

    this.frameCount++;
    this.frameCount %= this.updateEachAmountOfFrame;

    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }

  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopHEX());
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopHEX());

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());


    this.cellSize = this.screenWidth / this.columns;
    this.rows = Math.ceil(this.screenHeight / this.cellSize);
    for (let i = 0; i < this.rows; i++) {
      let row: boolean[] = [];
      for (let j = 0; j < this.columns; j++) {
        //row.push(Math.random() > 0.5);
        row.push(false);
      }
      this.grid.push(row);
    }
    this.setAntInTheMiddle();
    this.antDirection = 0;
  }

  private update(): void {
    if (this.grid[this.antPosition[0]][this.antPosition[1]]) {
      this.antDirection = (this.antDirection + 3) % 4;
    }
    else {
      this.antDirection = (this.antDirection + 1) % 4;
    }

    this.grid[this.antPosition[0]][this.antPosition[1]] = !this.grid[this.antPosition[0]][this.antPosition[1]];
    // Move ant forward:
    switch (this.antDirection) { // 0: up, 1: left, 2: down, 3: right
      case 0: {
        this.antPosition[0] += 1;
        break;
      }
      case 1: {
        this.antPosition[1] += 1;
        break;
      }
      case 2: {
        this.antPosition[0] -= 1;
        break;
      }
      case 3: {
        this.antPosition[1] -= 1;
        break;
      }
    }
    if (this.antPosition[1] < 0 || this.antPosition[1] >= this.columns - 1 || this.antPosition[0] < 0 || this.antPosition[0] >= this.rows - 1) {
      // ant is outside of the screen
      this.setAntInTheMiddle();
    }
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    //ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

  }

  private drawGrid(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    for (let i = 0; i < this.rows; i++) { // start from 1 and ends at +1 because of padding
      for (let j = 0; j < this.columns; j++) { // start from 1 and ends at +1 because of padding
        if (this.grid[i][j]) {
          ctx.fillStyle = this.gradient2;
          ctx.fillRect(this.cellSize * j, this.cellSize * i, this.cellSize, this.cellSize);
        }
      }
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.cellSize * this.antPosition[1], this.cellSize * this.antPosition[0], this.cellSize, this.cellSize);

  }

  private setAntInTheMiddle(): void {
    let antPosX = Math.floor(this.rows / 2);
    let antPosY = Math.floor(this.columns / 2);
    this.antPosition = [antPosX, antPosY];
  }
}
