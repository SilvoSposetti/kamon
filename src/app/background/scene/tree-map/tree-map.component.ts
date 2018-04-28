import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import OpenSimplexNoise from 'open-simplex-noise';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-tree-map',
  templateUrl: './tree-map.component.html',
  styleUrls: ['./tree-map.component.css']
})
export class TreeMapComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private alphaGradient: CanvasGradient;

  private heap: number[][] = [];
  private numOfElements: number;
  // one element contains: [top,left,bottom,right,lineFromX,lineFromY,lineToX,lineToY,depth,subdivide]
  // subdivide: if 1 then vertically, 0 horizontally
  private depth: number = 12;
  private endFadingFrames = 100;
  private noise = new OpenSimplexNoise(Date.now());
  private noiseValue = 0;
  private noiseIncrement = 1;


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
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.alphaGradient = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.alphaGradient.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.15));
    this.alphaGradient.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.15));

    // Set up heap:
    this.numOfElements = Math.pow(2, this.depth);
    // [top,left,bottom,right,lineFromX,lineFromY,lineToX,lineToY,depth,subdivide]

    for (let i = 0; i < this.numOfElements; i++) {
      if (i === 0) {
        // first is split vertically.
        let fromX = this.screenWidth * this.getDivision();
        let toX = fromX;
        let fromY = 0;
        let toY = this.screenHeight;
        this.heap.push([0, 0, this.screenHeight, this.screenWidth, fromX, fromY, toX, toY, 1, 1]);
      }
      let parentIndex = Math.floor(i / 2);
      let parent = this.heap[parentIndex];
      if (i % 2 === 1) { // Case Left/Over child
        if (parent[9] === 1) { // Split Vertically before
          let top = parent[0];
          let bottom = parent[2];
          let left = parent[1];
          let right = parent[6];
          let depth = parent[8] + 1;

          let division = this.getDivision();
          let lineFromX = left;
          let lineToX = right;
          let lineFromY = top + (bottom - top) * division;
          let lineToY = lineFromY;

          this.heap.push([top, left, bottom, right, lineFromX, lineFromY, lineToX, lineToY, depth, 0]);
        }
        else { // Split Horizontally before
          let top = parent[0];
          let bottom = parent[5];
          let left = parent[1];
          let right = parent[3];
          let depth = parent[8] + 1;

          let division = this.getDivision();
          let lineFromX = left + (right - left) * division;
          let lineToX = lineFromX;
          let lineFromY = top;
          let lineToY = bottom;

          this.heap.push([top, left, bottom, right, lineFromX, lineFromY, lineToX, lineToY, depth, 1]);
        }
      }
      else { // Case Right/Under child
        if (parent[9] === 1) { // Split Vertically before
          let top = parent[0];
          let bottom = parent[2];
          let left = parent[4];
          let right = parent[3];
          let depth = parent[8] + 1;

          //let division = Math.random();
          let division = this.getDivision();
          let lineFromX = left;
          let lineToX = right;
          let lineFromY = top + (bottom - top) * division;
          let lineToY = lineFromY;

          this.heap.push([top, left, bottom, right, lineFromX, lineFromY, lineToX, lineToY, depth, 0]);
        }
        else { // Split Horizontally before
          let top = parent[5];
          let bottom = parent[2];
          let left = parent[1];
          let right = parent[3];
          let depth = parent[8] + 1;

          let division = this.getDivision();
          let lineFromX = left + (right - left) * division;
          let lineToX = lineFromX;
          let lineFromY = top;
          let lineToY = bottom;

          this.heap.push([top, left, bottom, right, lineFromX, lineFromY, lineToX, lineToY, depth, 1]);
        }
      }
    }
    this.heap = this.shuffle(this.heap);
  }

  public update(): void {
  };


  public draw(): void {

    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.alphaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    //for (let i = 0; (i < this.linesPerFrame) && (this.frameCount <= this.numOfElements); ++i) {
      // draw lines
      //ctx.strokeStyle = this.sandGradient;
      //ctx.lineWidth = 2;
      //ctx.beginPath();
      //ctx.moveTo(this.heap[this.frameCount][4], this.heap[this.frameCount][5]);
      //ctx.lineTo(this.heap[this.frameCount][6], this.heap[this.frameCount][7]);
      //ctx.closePath();
      //ctx.stroke();

      // Draw rectangles
    if(this.frameCount <= this.numOfElements){
      if (this.heap[this.frameCount][8] === this.depth) {
        ctx.fillStyle = this.sandGradient;
        let posX = this.heap[this.frameCount][1];
        let posY = this.heap[this.frameCount][0];
        let width = this.heap[this.frameCount][3] - this.heap[this.frameCount][1];
        let height = this.heap[this.frameCount][2] - this.heap[this.frameCount][0];
        ctx.fillRect(posX, posY, width, height);
      }
    }

    if (this.frameCount >= this.numOfElements + this.endFadingFrames) {
      this.terminateCore();
    }
  }


  private getDivision(): number {
    //return Math.random();
    this.noiseValue += this.noiseIncrement;
    let noise = this.noise.noise2D(0, this.noiseValue);
    return (noise + 1) / 2;
    //return 0.5;
    //return (1 + Math.sqrt(5))/2 -1;
  }

  private shuffle(array: number[][]): number[][] {
    // Fisher-Yates (aka Knuth) Shuffle:
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
