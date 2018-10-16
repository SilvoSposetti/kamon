import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ColorService} from "../../../shared/services/color.service";
import {FpsService} from "../../../shared/services/fps.service";
import {Scene} from "../../../shared/models/Scene";

@Component({
  selector: 'app-hexagons',
  templateUrl: './hexagons.component.html',
  styleUrls: ['./hexagons.component.css']
})
export class HexagonsComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private numOfHHexes: number = 25;
  private numOfVHexes: number;

  private hexGrid: number[][][]; // Each element contains: [centerX, centerY, baseValue]
  private hexSize: number;
  private rowSeparation: number;
  private halfSide: number;
  private halfDiagonal: number;

  private time: number = 0;
  private timeIncrement: number = 0.01;

  private prevScreenH: number = 0;
  private prevScreenW: number = 0;

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy(): void {
    this.terminateCore();
  }

  /*****************************************************************************************************************************************
   * SETUP */
  public setup(): void {
    this.defineGrid();
    this.storeNewScreenSizes();
  }

  private defineGrid(): void {
    this.hexSize = this.screenWidth / (this.numOfHHexes - 1); // -1 because so we have an additional hex for odd-numbered rows.
    this.halfSide = Math.tan(30 * Math.PI / 180) * this.hexSize / 2;

    this.rowSeparation = this.halfSide * 3;
    this.numOfVHexes = Math.ceil(this.screenHeight / this.rowSeparation) + 1;
    this.halfDiagonal = this.halfSide * 2;


    // (re)define new grid;
    this.hexGrid = [];
    for (let i = 0; i < this.numOfHHexes; i++) {
      let row: number[][] = [];
      for (let j = 0; j < this.numOfVHexes; j++) {
        // let value =  2 * Math.PI * Math.random();
        let scale = 3.01;
        let cos = Math.cos(i * scale);
        let sin = Math.sin(j * scale);
        let value = cos * cos + sin * sin;
        row.push([this.hexSize * i, this.rowSeparation * j, value]);
      }
      this.hexGrid.push(row);
    }

  }

  /*****************************************************************************************************************************************
   * UPDATE */
  public update(): void {
    if (this.screenSizesHaveChanged()) {
      this.defineGrid();
      this.storeNewScreenSizes();
    }

    this.time += this.timeIncrement;
  }


  /*****************************************************************************************************************************************
   * DRAW */
  public draw(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    this.drawBackground();
    ctx.strokeStyle = this.sandGradient;
    ctx.fillStyle = this.sandGradient;


    let phase = 0;
    for (let i = 0; i < this.numOfHHexes; i++) {
      for (let j = 0; j < this.numOfVHexes; j++) {
        ctx.beginPath();
        if (j % 2 === 1) {
          phase = -this.hexSize / 2;
        }
        else {
          phase = 0;
        }
        this.drawHex(this.hexGrid[i][j][0] + phase + this.hexSize / 2, this.hexGrid[i][j][1] + this.hexSize / 2 - this.halfSide, this.hexGrid[i][j][2]);
      }
    }

  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawHex(centerX: number, centerY: number, baseValue: number) {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.save();
    ctx.globalAlpha = (Math.pow(Math.cos(baseValue + this.time), 3) + 1) / 2;
    ctx.beginPath();
    ctx.moveTo(centerX + this.hexSize / 2, centerY - this.halfSide); // Vertex 0
    ctx.lineTo(centerX, centerY - this.halfDiagonal); // Vertex 1
    ctx.lineTo(centerX - this.hexSize / 2, centerY - this.halfSide); // Vertex 2
    ctx.lineTo(centerX - this.hexSize / 2, centerY + this.halfSide); // Vertex 3
    ctx.lineTo(centerX, centerY + this.halfDiagonal); // Vertex 4
    ctx.lineTo(centerX + this.hexSize / 2, centerY + this.halfSide); // Vertex 5
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  }


  /*****************************************************************************************************************************************
   * OTHER */
  private screenSizesHaveChanged(): boolean {
    return this.prevScreenH !== this.screenHeight || this.prevScreenW !== this.screenWidth;
  }

  private storeNewScreenSizes(): void {
    this.prevScreenH = this.screenHeight;
    this.prevScreenW = this.screenWidth;
  }

}




