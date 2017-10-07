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

  private running: boolean;
  private spacing: number = 10;
  private sectors: number[][][] = [];
  private columns: number;
  private rows: number;
  private counter = 0;
  private nrOfElements: number;

  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.initSectors();
    this.paint();
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    if (!this.running) {
      return;
    }
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.stroke();
    //for (let k = 0; k < this.columns; k++) {
      for (let k = 0; k < 50; k++) {
      let i = this.counter % this.columns;
      let j = Math.floor(this.counter / this.columns);

      let x = this.sectors[i][j][0];
      let y = this.sectors[i][j][1];

      // Paint current frame

      let random = Math.random();

      if (random < 0.25) {
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.spacing, y + this.spacing);
        ctx.stroke();
      }
      else if(random<0.9){
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.moveTo(x + this.spacing, y);
        ctx.lineTo(x, y + this.spacing);
        ctx.stroke();
      }
      else{
      }

      this.counter++;
    }
    if (this.counter >= this.nrOfElements) {
      this.running = false;
    }
     //Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private initSectors(): void {
    this.columns = Math.ceil(this.screenWidth / this.spacing);
    this.rows = Math.ceil(this.screenHeight / this.spacing);
    console.log(this.screenWidth, this.screenHeight, this.columns, this.rows);
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

}
