import {Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-langtons-ant',
  templateUrl: './langtons-ant.component.html',
  styleUrls: ['./langtons-ant.component.css']
})
export class LangtonsAntComponent extends Scene implements AfterViewInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private columns: number = 101; // Best if it is an odd number;
  private rows: number;
  private cellSize: number;
  private grid: boolean[][] = [];
  private antPosition: number[] = []; // [posX, posY] in the grid
  private antDirection: number; // 0: up, 1: left, 2: down, 3: right


  // each element of the grid contains false for black and true for white.

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngAfterViewInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  public setup(): void {
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

  public update(): void {
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

  public draw(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    for (let i = 0; i < this.rows; i++) { // start from 1 and ends at +1 because of padding
      for (let j = 0; j < this.columns; j++) { // start from 1 and ends at +1 because of padding
        if (this.grid[i][j]) {
          ctx.fillStyle = this.sandGradient;
        }
        else {
          ctx.fillStyle = this.seaGradient;
        }
        ctx.fillRect(this.cellSize * j, this.cellSize * i, this.cellSize, this.cellSize);

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
