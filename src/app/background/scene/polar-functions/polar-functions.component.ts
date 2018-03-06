import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-polar-functions',
  templateUrl: './polar-functions.component.html',
  styleUrls: ['./polar-functions.component.css']
})
export class PolarFunctionsComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;

  private numOfEpicycloids: number = 150;
  private numOfHypocycloids: number = 150;
  private functionsValues: number[][] = [];
  // [xPos, yPos, previousXPos, previousYPos, angle, angleIncrement, functionType]
  // functionType is 0 for epicycloid, 1 for hypocycloid.
  private delimiter: number = 200;
  private epicycloidRadius: number = 100;
  private hypocylcloidRadius: number = 100;
  private k: number = (1 + Math.sqrt(5)) / 2;
  private lineWidth: number = 3;

  constructor(private fpsService: FpsService) {
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
    this.updateFunctions();
    this.drawBackground();
    this.drawFunctions();
    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }

  private setup(): void {
    this.delimiter = this.screenHeight / 3.8;
    this.epicycloidRadius = this.delimiter / (this.k * 2);
    this.hypocylcloidRadius = this.delimiter * (this.k * 2);
    for (let i = 0; i < this.numOfEpicycloids; i++) {
      let startingAngle = this.k * 10 * i;
      let angleIncrement = 0.005 + (i + 1) * 0.00001;
      let firstValue = this.epicycloid(startingAngle, this.delimiter, this.k);
      this.functionsValues.push([firstValue[0], firstValue[1], firstValue[0], firstValue[1], startingAngle, angleIncrement, 0]);
    }
    for (let i = 0; i < this.numOfHypocycloids; i++) {
      let startingAngle = this.k * 10 * i;
      let angleIncrement = 0.005 + (i + 1) * 0.00001;
      let firstValue = this.hypocycloid(startingAngle, this.delimiter, this.k);
      this.functionsValues.push([firstValue[0], firstValue[1], firstValue[0], firstValue[1], startingAngle, angleIncrement, 1]);
    }
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private updateFunctions(): void {
    let amountOfFunctions: number = this.numOfHypocycloids + this.numOfEpicycloids;
    for (let i = 0; i < amountOfFunctions; ++i) {
      this.functionsValues[i][2] = this.functionsValues[i][0];
      this.functionsValues[i][3] = this.functionsValues[i][1];
      let newCoordinates: number[];
      if (this.functionsValues[i][6] === 0) {
        newCoordinates = this.epicycloid(this.functionsValues[i][4], this.delimiter, this.k);
      }
      else if (this.functionsValues[i][6] === 1) {
        newCoordinates = this.hypocycloid(this.functionsValues[i][4], this.delimiter, this.k);
      }
      this.functionsValues[i][0] = newCoordinates[0];
      this.functionsValues[i][1] = newCoordinates[1];
      this.functionsValues[i][4] += this.functionsValues[i][5];
    }
  }

  private drawFunctions(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = this.lineWidth;
    let amountOfValues = this.numOfEpicycloids + this.numOfHypocycloids;
    for (let i = 0; i < amountOfValues; i++) {
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.functionsValues[i][2] + this.screenWidth / 2, this.functionsValues[i][3] + this.screenHeight / 2);
      ctx.lineTo(this.functionsValues[i][0] + this.screenWidth / 2, this.functionsValues[i][1] + this.screenHeight / 2);
      ctx.closePath();
      //ctx.beginPath();
      //ctx.arc(this.functionsValues[i][2] + this.screenWidth /2 ,this.functionsValues[i][3] + this.screenHeight / 2,5,0,Math.PI*2);
      //ctx.closePath();
      //ctx.fill();
      ctx.stroke();
    }
  }

  // returns the coordinates of the epicycloid with internal radius 'radius' and external radius 'k'*'radius' at angle 'angle'
  private epicycloid(angle, radius, k): number[] {
    let x = (radius * (k + 1)) * Math.cos(angle) - radius * Math.cos((k + 1) * angle);
    let y = (radius * (k + 1)) * Math.sin(angle) - radius * Math.sin((k + 1) * angle);
    return [x, y];
  }

  // returns the coordinates of the epicycloid with internal radius 'radius' and external radius 'k'*'radius' at angle 'angle'
  private hypocycloid(angle, radius, k): number[] {
    let x = (radius * (k - 1)) * Math.cos(angle) + radius * Math.cos((k - 1) * angle);
    let y = (radius * (k - 1)) * Math.sin(angle) - radius * Math.sin((k - 1) * angle);
    return [x, y];
  }

}
