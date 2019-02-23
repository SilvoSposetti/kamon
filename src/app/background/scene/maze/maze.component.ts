import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Scene} from '../../../shared/models/Scene';
import {ColorService} from '../../../shared/services/color.service';


@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  private mazeCellSize: number = 7; // expressed in terms of gridCells
  private mazeProbabilityGrid: boolean[][] = [];
  private mazeWallSize: number = 3; // Must be less than


  private cellPixelRatio: number = 1;
  private amountOfStartCandidates: number = 100000;
  private grid: boolean[][] = [];
  private columns: number;
  private rows: number;
  private nrOfElements: number;

  private cellsToDraw: number[][] = []; // contains indices of the grid to be filled
  private cellsDrawnLastFrame: number[][] = []; // contains indices of the grid to be filled

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  public setup(): void {
    this.initializeMazeGrid();
    this.initializeGridEntries();
    this.selectStartingPositions();
  }


  private initializeMazeGrid(): void {
    // True represent top-left to bottom-right diagonal, false is the other one
    let probabilityGridRows = Math.ceil((this.screenWidth / this.cellPixelRatio) / this.mazeCellSize);
    let probabilityGridColumns = Math.ceil((this.screenHeight / this.cellPixelRatio) / this.mazeCellSize);

    for (let i = 0; i < probabilityGridColumns; i++) {
      let row: boolean[] = [];
      for (let j = 0; j < probabilityGridRows; j++) {
        row.push(Math.random() < 0.5);
      }
      this.mazeProbabilityGrid.push(row);
    }

  }

  private initializeGridEntries(): void {
    this.columns = Math.ceil(this.screenWidth / (this.cellPixelRatio));
    this.rows = Math.ceil(this.screenHeight / (this.cellPixelRatio));
    this.nrOfElements = this.rows * this.columns;

    for (let i = 0; i < this.columns; ++i) {
      let row: boolean[] = [];
      for (let j = 0; j < this.rows; ++j) {

        let probabilityGridX = Math.floor(i / this.mazeCellSize);
        let probabilityGridY = Math.floor(j / this.mazeCellSize);

        let innerX = i % this.mazeCellSize;
        let innerY = j % this.mazeCellSize;

        if (this.mazeProbabilityGrid[probabilityGridY][probabilityGridX]) {

          innerX = this.mazeCellSize - innerX;
        }

        // Set "walls" to true
        row.push(Math.abs(innerX - innerY) < this.mazeWallSize || // Removes internal diagonal
          (this.mazeCellSize - Math.abs(innerX - innerY)) < this.mazeWallSize); // Removes "outer" diagonal (the dots of the % sign)
      }
      this.grid.push(row);
    }
  }

  private selectStartingPositions(): void {
    let extent =  Math.min(this.screenWidth / 6, this.screenHeight / 4) * 2;
    for (let i = 0; i < this.amountOfStartCandidates; i++) {
      let angle = i * 2 * Math.PI / this.amountOfStartCandidates;
      let r = Math.sqrt(2*Math.cos(2*angle));
      let x = this.screenWidth / 2 + Math.cos(angle) * extent * r;
      let y = this.screenHeight / 2 + Math.sin(angle) * extent * r;
      this.cellsDrawnLastFrame.push([Math.floor(x / this.cellPixelRatio), Math.floor(y / this.cellPixelRatio)]);
    }
  }

  public update() {
    if (this.cellsDrawnLastFrame.length === 0) {
      this.terminateCore();
    } else {
      this.cellsToDraw = [];
      for (let i = 0; i < this.cellsDrawnLastFrame.length; i++) {
        // push neighbours of last cells drawn into cellsToDraw
        let top = [this.cellsDrawnLastFrame[i][0], this.cellsDrawnLastFrame[i][1] - 1];
        let bottom = [this.cellsDrawnLastFrame[i][0], this.cellsDrawnLastFrame[i][1] + 1];
        let left = [this.cellsDrawnLastFrame[i][0] - 1, this.cellsDrawnLastFrame[i][1]];
        let right = [this.cellsDrawnLastFrame[i][0] + 1, this.cellsDrawnLastFrame[i][1]];
        let neighbours = [top, bottom, left, right];

        for (let j = 0; j < neighbours.length; j++) {
          if (neighbours[j][0] >= 0 && neighbours[j][0] < this.columns && neighbours[j][1] >= 0 && neighbours[j][1] < this.rows) { // cell is inside grid
            if (!this.grid[neighbours[j][0]][neighbours[j][1]]) { // cell has not been selected yet
              this.cellsToDraw.push(neighbours[j]);
              this.grid[neighbours[j][0]][neighbours[j][1]] = true;
            }
          }
        }
      }
    }

    //}
  }

  //private pickNewStartPoint(tries: number): number[] {
  //  if (tries >= 30) {
  //    this.terminateCore();
  //    console.log('terminated');
  //    return;
  //  }
  //  let x = Math.floor(Math.random() * this.rows);
  //  let y = Math.floor(Math.random() * this.columns);
  //  if (this.grid[y][x]) {
  //    this.pickNewStartPoint(tries + 1);
  //  } else {
  //    this.grid[x][y] = true;
  //    return [x, y];
  //  }
  //}


  public draw(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.cellsDrawnLastFrame = [];
    ctx.fillStyle = this.sandGradient;
    if (this.cellsToDraw !== []) {
      for (let i = 0; i < this.cellsToDraw.length; i++) {
        if (this.cellsToDraw[i] !== undefined) {
          ctx.fillRect(this.cellsToDraw[i][0] * this.cellPixelRatio, this.cellsToDraw[i][1] * this.cellPixelRatio, this.cellPixelRatio, this.cellPixelRatio);
          this.cellsDrawnLastFrame.push(this.cellsToDraw[i]);
        }
      }
    }
  }
}
