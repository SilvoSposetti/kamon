import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-harmonic-functions',
  templateUrl: './harmonic-functions.component.html',
  styleUrls: ['./harmonic-functions.component.css']
})
export class HarmonicFunctionsComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private alphaGradient : CanvasGradient;

  private functionValues: number[][];
  // [xPos, yPos, previousXPos, previousYPos]
  private numOfFunctions: number = 4;
  // sin, cos
  private rowHeight: number;
  private rowsCenter: number[] = [];
  private xForward: number[] = [5.5, 4.5, 5, 3.5];
  private loops: number[] = [];

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  public draw(): void {

    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = this.alphaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.numOfFunctions; i++) {

      ctx.strokeStyle = this.sandGradient;
      ctx.lineWidth = this.screenHeight / 200;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.functionValues[i][2], this.functionValues[i][3]);
      ctx.lineTo(this.functionValues[i][0], this.functionValues[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  public setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.alphaGradient = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.alphaGradient.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.alphaGradient.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));

    this.rowHeight = this.screenHeight / this.numOfFunctions;
    this.functionValues = [];
    for (let i = 0; i < this.numOfFunctions; i++) {
      this.rowsCenter.push((i) * this.rowHeight + this.rowHeight / 2);
      this.functionValues.push([0, this.rowsCenter[i], 0, this.rowsCenter[i]]);
      this.loops.push(0);
    }
  }

  public update(): void {
    for (let i = 0; i < this.numOfFunctions; i++) {
      if (this.functionValues[i][0] >= this.screenWidth) {
        this.functionValues[i][0] = 0;
        this.loops[i]++;
      }
    }
    for (let i = 0; i < this.numOfFunctions; ++i) {
      this.functionValues[i][2] = this.functionValues[i][0];
      if (this.functionValues[i][0] === 0) {  //Otherwise when function is reset back to 0 it will draw a line from the height where it left before.
        this.functionValues[i][3] = this.functions(i, 0);
      }
      else {
        this.functionValues[i][3] = this.functionValues[i][1];
      }
      this.functionValues[i][0] = this.functionValues[i][0] + this.xForward[i];
      this.functionValues[i][1] = this.functions(i, this.functionValues[i][0]);
    }
  }

  private functions(functionNumber: number, x: number): number {
    switch (functionNumber) {
      case 0:
        return this.function0(functionNumber, x);
      case 1:
        return this.function1(functionNumber, x);
      case 2:
        return this.function2(functionNumber, x);
      case 3:
        return this.function3(functionNumber, x);
    }
  }

  private function0(functionNumber: number, x: number): number {
    let angularVelocity = 0.02;
    return this.rowsCenter[functionNumber] + this.rowHeight * 4 / 10 * Math.sin(x * angularVelocity) * Math.pow(-1, this.loops[functionNumber]) * (0.1) * Math.ceil(10 - (this.loops[functionNumber] * 0.5 + 1) % 11);
  }

  private function1(functionNumber: number, x: number): number {
    let angularVelocity = 0.1;
    return this.rowsCenter[functionNumber] + this.rowHeight * 4 / 10 * Math.pow(-1, this.loops[functionNumber]) * Math.sin(x * angularVelocity * Math.pow(2, -Math.floor((this.loops[functionNumber] * 0.5) % 6)));
  }

  private function2(functionNumber: number, x: number): number {
    let angularVelocity1 = 0.012;
    let angularVelocity2 = 0.01;
    return this.rowsCenter[functionNumber] + this.rowHeight * 4 / 10 * Math.sin(x * angularVelocity1 + Math.PI * (this.loops[functionNumber] % 16) / 8) * Math.sin(x * angularVelocity2);
  }

  private function3(functionNumber: number, x: number): number {
    let angularVelocity = 0.1;
    let layers = 11; // select only odd numbers
    let distanceFromCenter = Math.pow(-1, this.loops[functionNumber]) * Math.floor(this.rowHeight / (layers + 5)) * (Math.floor(this.loops[functionNumber] * 0.5 + 0.5) % Math.ceil((layers) / 2));
    return this.rowsCenter[functionNumber] + distanceFromCenter + this.rowHeight / layers * 8 / 10 * Math.sin(x * angularVelocity);
  }

  // Steps to add a function:
  // 1: declare it here.
  // 2: add the case into functions function.
  // 3: increment numOfFunctions by 1.
  // 4: add its 'speed' into xForward array.

}

