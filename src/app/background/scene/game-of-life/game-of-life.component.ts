import {Component, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})
export class GameOfLifeComponent extends Scene implements AfterViewInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private columns: number = 202;
  private rows: number;
  private cellSize: number;
  private grid: boolean[][] = [];
  private updateEachAmountOfFrame: number = 3;
  private paddingValue: boolean = false;

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

  public update(): void {
    if (this.frameCount % this.updateEachAmountOfFrame === 0) {
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
  }

  public draw(): void {
    if (this.frameCount % this.updateEachAmountOfFrame === 0) {

      this.drawBackground();
      this.drawGrid();
    }
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    //ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

  }

  private drawGrid(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.sandGradient;
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
}
