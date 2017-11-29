import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;

  public fps = 0;
  private now: number;
  private lastUpdate = new Date().getTime();
  public frameFps = 0;
  // The higher this value, the less the FPS will be affected by quick changes
  // Setting this to 1 will show you the FPS of the last sampled frame only
  public fpsFilter = 100;


  private running: boolean;
  private spacing: number = 15;
  private sectors: number[][][] = [];
  private columns: number;
  private rows: number;
  private counter = 0;
  private nrOfElements: number;
  private nrOfCellsPerFrame: number = 100;

  private lineWidth = 5;
  private pixelsSize = 3;

  private amountOfStains: number = 3;
  private maxNumberOfElementsInSets = 10;
  private stainsPositionsSetsArray = [];


  private blankColour: number = 50;
  private wallColour: number = 10;
  private stainColour: number = 200;

  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.initSectors();
    requestAnimationFrame(() => this.paint());
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.stroke();
    if (this.counter === 0) {
      ctx.fillStyle = this.toHexColour(this.blankColour);
      ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }


    // Calculates fps
    this.now = new Date().getTime();
    this.frameFps = 1000 / (this.now - this.lastUpdate);
    if (this.now != this.lastUpdate) {
      this.fps += (this.frameFps - this.fps) / this.fpsFilter;
      this.frameFps = Math.ceil(this.frameFps);
      this.lastUpdate = this.now;
    }

    // LABYRINTH DRAWING PHASE
    if (this.counter < this.nrOfElements) {
      for (let k = 0; k < this.nrOfCellsPerFrame; k++) {
        if (this.counter < this.nrOfElements) {
          let i = this.counter % this.columns;
          let j = Math.floor(this.counter / this.columns);

          let x = this.sectors[i][j][0];
          let y = this.sectors[i][j][1];

          // Paint current frame
          ctx.strokeStyle = this.toHexColour(this.wallColour);
          let random = Math.random();

          ctx.lineWidth = this.lineWidth;
          if (random < 0.45) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.spacing, y + this.spacing);
            ctx.stroke();
          }
          else if (random < 0.9) {
            ctx.beginPath();
            ctx.moveTo(x + this.spacing, y);
            ctx.lineTo(x, y + this.spacing);
            ctx.stroke();
          }
        }
        this.counter++;
      }
    }
    // STAIN DRAWING PHASE
    else {
      for(let i = 0 ; i<this.amountOfStains; i++){
        this.updatePath(i);
      }
    }

    //Schedule next
    if (this.running) {
      requestAnimationFrame(() => this.paint());
    }
    else {
      console.log('finished');
    }
  }

  private initSectors(): void {
    for (let i = 0; i<this.amountOfStains; i++){
      this.stainsPositionsSetsArray.push(new Set<number[]>());
    }

    this.columns = Math.ceil(this.screenWidth / this.spacing);
    this.rows = Math.ceil(this.screenHeight / this.spacing);
    this.nrOfElements = this.rows * this.columns;
    for (let i = 0; i < this.columns; ++i) {
      this.sectors.push([]);
      for (let j = 0; j < this.rows; ++j) {
        let x = this.spacing * i;
        let y = this.spacing * j;
        this.sectors[i].push([x, y]);
      }
    }
  }

  private updatePath(stainNr: number): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    let imageData = ctx.getImageData(0, 0, this.screenWidth, this.screenHeight);
    let data = imageData.data;
    
    let newSet: Set<number[]> = new Set<number[]>();

    // if set is empty then take a random point on the image.
    if (this.stainsPositionsSetsArray[stainNr].size === 0) {
      let found = false;
      let counter = 0;
      while (!found) {
        let randomX = Math.floor(Math.random() * this.screenWidth);
        let randomY = Math.floor(Math.random() * this.screenHeight);
        let randomPositionDataIndex = this.getImageDataIndex(randomX, randomY);
        if (data[randomPositionDataIndex] === this.blankColour) {
          newSet.add([randomX, randomY]);
          found = true;
        }
        if (counter > 100) { // If a blank position is not found after 100 tries, then the canvas is probably all coloured.
          this.running = false;
          found = true;
          console.log('not found 100 times');
        }
        counter++;
      }
    }
    else { // Set is not empty, thus need to iterate on each element
      // for each element: check its color and the one of its neighbours.
      //this.positions.forEach((element) => {
      for (let element of this.stainsPositionsSetsArray[stainNr]) {
        // Paint pixel of stain color
        ctx.fillStyle = this.toHexColour(this.stainColour);
        ctx.fillRect(element[0], element[1], this.pixelsSize, this.pixelsSize);

        // Define neighbours:
        let top = [element[0], element[1] - this.pixelsSize];
        let left = [element[0] - this.pixelsSize, element[1]];
        let bottom = [element[0], element[1] + this.pixelsSize];
        let right = [element[0] + this.pixelsSize, element[1]];

        // Check neighbours
        if (newSet.size <= this.maxNumberOfElementsInSets) {
          if (data[this.getImageDataIndex(top[0], top[1])] === this.blankColour && top[1] >= 0) {
            newSet.add(top);
          }
          if (data[this.getImageDataIndex(left[0], left[1])] === this.blankColour && left[0] >= 0) {
            newSet.add(left);
          }
          if (data[this.getImageDataIndex(bottom[0], bottom[1])] === this.blankColour && bottom[1] < this.screenHeight) {
            newSet.add(bottom);
          }
          if (data[this.getImageDataIndex(right[0], right[1])] === this.blankColour && right[0] < this.screenWidth) {
            newSet.add(right);
          }
        }
        else {
          break;
        }
      }
    }
    this.stainsPositionsSetsArray[stainNr] = newSet;


  }

  private getImageDataIndex(xIndex: number, yIndex: number): number {
    return (yIndex * this.screenWidth + xIndex) * 4;

  }

  private toHexColour(numberBaseTen: number): string {
    let str = numberBaseTen.toString(16);
    if (str.length <= 1) {
      str = '0' + str;
    }
    return '#' + str + str + str;
  }


  // WANT TO WRITE YOUR OWN SHADER? :)
  //if(this.switcherino){
  //
  //  let imageData = ctx.getImageData(0, 0, this.screenWidth, this.screenHeight);
  //  let data = imageData.data;
  //  for (let i = 0; i < data.length; i += 4) {
  //    data[i] = 255 - data[i];     // red
  //    data[i + 1] = 255 - data[i+1]; // green
  //    data[i + 2] = 255 - data[i+2]; // blue
  //    data[i + 3] = 255;
  //  }
  //  ctx.putImageData(imageData, 3, 3);
  //  this.switcherino = false;
  //}
}
