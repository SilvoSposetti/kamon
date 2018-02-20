import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})
export class GameOfLifeComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;


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
  private framesToWaitBeforeMean: number = 40;


  private running: boolean;

  private columns: number = 202;
  private rows: number;
  private cellSize: number;
  private grid: boolean[][] = [];
  private updateEachAmountOfFrame: number = 3;
  private frameCount: number = 0;
  private frameDrawnCount: number = 0;
  private paddingValue: boolean = false;

  // each element of the grid contains false for black and true for white.

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

  private loop(): void {
    this.updateFps();
    if (this.frameCount === 0) {
      this.drawBackground();
      // do update before draw so that the first 'setup' is not drawn.
      this.update();
      this.drawGrid();
      this.frameDrawnCount++;
    }

    this.frameCount++;
    this.frameCount %= this.updateEachAmountOfFrame;
    // Stop the scene after some iterations:
    //if (this.frameDrawnCount === 1200) {
    //  this.running = false;
    //}
    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }

  private setup(): void {
    // Variables initialization:
    this.cellSize = this.screenWidth / this.columns;
    this.rows = Math.ceil(this.screenHeight / this.cellSize);
    let value: boolean;
    // grid is generated with one cell as padding in each directions.
    let firstAndLastRow: boolean[] = []; // Used as first and last padding rows
    for (let i = 0; i < this.columns + 2; i++) {
      firstAndLastRow.push(this.paddingValue);
    }
    this.grid.push(firstAndLastRow); // push first padding row
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      row.push(this.paddingValue); // push first padding cell of the row
      for (let j = 0; j < this.columns; j++) {
        // Select random number
        // value = Math.random() > 0.8;

        value = (i * j) % 3 === 0;
        row.push(value);
      }
      row.push(this.paddingValue); // Push last padding cell of the row
      this.grid.push(row);
    }
    this.grid.push(firstAndLastRow); // push last padding row
  }

  private update(): void {
    let positionsToModify: number[][] = [];
    for (let i = 1; i < this.rows + 1; i++) { // start from 1 and ends at +1 because of padding
      for (let j = 1; j < this.columns + 1; j++) { // start from 1 and ends at +1 because of padding
        let neighbours = this.checkNeighbours(i, j);
        if (this.grid[i][j]) { // Cell is alive.
          if (neighbours <= 1) { // 1: Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
            positionsToModify.push([i, j]);
          }
          else if (neighbours >= 4) { // 2: Any live cell with more than three live neighbours dies, as if by overpopulation.
            positionsToModify.push([i, j]);
          }
          // not really needed
          //else { // 3: Any live cell with two or three live neighbours lives on to the next generation.
          //newGrid[i][j] = true;
          //}
        }
        else { // Cell is dead.
          if (neighbours === 3) { // 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            positionsToModify.push([i, j]);
          }
        }
      }
    }
    for (let k = 0; k < positionsToModify.length; k++) {
      this.grid[positionsToModify[k][0]][positionsToModify[k][1]] = !this.grid[positionsToModify[k][0]][positionsToModify[k][1]];
    }
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    //ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

  }

  private drawGrid(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = '#aaaaaa';
    for (let i = 1; i < this.rows + 1; i++) { // start from 1 and ends at +1 because of padding
      for (let j = 1; j < this.columns + 1; j++) { // start from 1 and ends at +1 because of padding
        if (this.grid[i][j]) {
          ctx.fillRect(this.cellSize * (j - 1), this.cellSize * (i - 1), this.cellSize, this.cellSize);
        }
      }
    }
  }

  // returns two numbers, the first is the number of adjacent live cells, the second is the number of adjacent dead cells.
  private checkNeighbours(i: number, j: number): number {
    let amountAlive: number = 0;
    // top
    if (this.grid[i - 1][j]) {
      amountAlive++;
    }
    // bottom
    if (this.grid[i + 1][j]) {
      amountAlive++;
    }
    // left
    if (this.grid[i][j - 1]) {
      amountAlive++;
    }
    // right
    if (this.grid[i][j + 1]) {
      amountAlive++;
    }
    // top-left
    if (this.grid[i - 1][j - 1]) {
      amountAlive++;
    }
    // top-right
    if (this.grid[i - 1][j + 1]) {
      amountAlive++;
    }
    // bottom-left
    if (this.grid[i + 1][j - 1]) {
      amountAlive++;
    }
    // bottom-right
    if (this.grid[i + 1][j + 1]) {
      amountAlive++;
    }
    return amountAlive;
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
