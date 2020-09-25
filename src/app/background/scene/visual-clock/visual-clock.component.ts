import {Component, Input} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';
import {ClockService} from "../../../shared/services/clock.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-visual-clock',
  templateUrl: './visual-clock.component.html',
  styleUrls: ['./visual-clock.component.css']
})

export class VisualClockComponent extends Scene {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private secondsFirstDigit: number = 0;
  private secondsSecondDigit: number = 0;
  private minutesFirstDigit: number = 0;
  private minutesSecondDigit: number = 0;
  private hoursFirstDigit: number = 0;
  private hoursSecondDigit: number = 0;

  private clock: number[] = [0, 0, 0]; // Stores interpolated values between 0 and 1 for each category
  // clock contains: [seconds, minutes, hours]

  private modValues: number[] = []; // Stores interpolated values between 0 and 1 for each circle
  private modModulo: number[] = [];
  private numOfMod: number = 25;

  // IN RATIOS:
  private secondsRatio: number = 3;
  private minutesRatio: number = 2;
  private hoursRatio: number = 1;
  private spacingRatio: number = 1;

  // IN PIXELS!:
  private secondsRadius: number = 0;
  private minutesRadius: number = 0;
  private hoursRadius: number = 0;
  private modBaseRadius: number = 0;

  private secondsWidth: number = 0;
  private minutesWidth: number = 0;
  private hoursWidth: number = 0;
  private spacingWidth: number = 0;
  private modElementWidth: number = 0;

  private minRadius: number = 0;
  private maxRadius: number = 0;
  private clockRadius: number = 0;


  private prevScreenWidth: number = 0;
  private prevScreenHeight: number = 0;

  constructor(public fpsService: FpsService, public colorService: ColorService, public clockService: ClockService) {
    super(fpsService, colorService);


    // Subscribe to clock service variables:
    this.clockService.getSecondsFirstDigit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.secondsFirstDigit = parseInt(value, 10);
    });
    this.clockService.getSecondsSecondDigit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.secondsSecondDigit = parseInt(value, 10);
    });
    this.clockService.getMinutesFirstDigit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.minutesFirstDigit = parseInt(value, 10);
    });
    this.clockService.getMinutesSecondDigit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.minutesSecondDigit = parseInt(value, 10);
    });
    this.clockService.getHoursFirstDigit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.hoursFirstDigit = parseInt(value, 10);
    });
    this.clockService.getHoursSecondDigit().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.hoursSecondDigit = parseInt(value, 10);
    });
  }

  /*****************************************************************************************************************************************
   * SETUP */
  public setup(): void {
    this.clockService.resetClock();


    // Fibonacci:
    this.modModulo[0] = 1;
    this.modModulo[1] = 2;
    for (let i = 2; i < this.numOfMod; i++) {
      this.modModulo[i] = this.modModulo[i - 2] + this.modModulo[i - 1];
    }

    // Anything else
    // for (let i = 1; i < this.numOfMod + 1; i++) {
    //   this.modModulo[i] = Math.pow(i, 3);
    // }
  }

  /*****************************************************************************************************************************************
   * UPDATE */
  public update(): void {
    // Update size variables only if screen size has changed:
    if (this.prevScreenWidth !== this.screenWidth || this.prevScreenHeight !== this.screenHeight) {
      this.updateSizes();
      this.prevScreenHeight = this.screenHeight;
      this.prevScreenWidth = this.screenWidth;
    }
    this.updateCircles();

  }

  private updateSizes(): void {

    if (this.screenWidth < this.screenHeight) {
      this.minRadius = this.screenWidth / 2;
    }
    else {
      this.minRadius = this.screenHeight / 2;
    }
    this.maxRadius = Math.sqrt(this.screenHeight * this.screenHeight + this.screenWidth * this.screenWidth) / 2;

    // update clock sizes:
    this.clockRadius = this.minRadius / 2;
    let clockSum = this.spacingRatio + this.secondsRatio + this.minutesRatio + this.hoursRatio;


    this.secondsWidth = this.clockRadius * this.secondsRatio / clockSum;
    this.minutesWidth = this.clockRadius * this.minutesRatio / clockSum;
    this.hoursWidth = this.clockRadius * this.hoursRatio / clockSum;
    this.spacingWidth = this.clockRadius * this.hoursRatio / clockSum;

    this.secondsRadius = this.secondsWidth / 2;
    this.minutesRadius = this.secondsWidth + this.minutesWidth / 2;
    this.hoursRadius = this.secondsWidth + this.minutesWidth + this.hoursWidth / 2;

    // Update fib sizes:
    this.modBaseRadius = this.clockRadius;
    this.modElementWidth = (this.maxRadius - this.clockRadius) / this.numOfMod;
  }

  private updateCircles(): void {

    let seconds = (this.secondsFirstDigit * 10 + this.secondsSecondDigit);
    let minutes = (this.minutesFirstDigit * 10 + this.minutesSecondDigit);
    let hours = (this.hoursFirstDigit * 10 + this.hoursSecondDigit);
    //Allows for circle to be drawn completely when on 0:
    if (seconds === 0) seconds = 60;
    if (minutes === 0) minutes = 60;
    if (hours === 0) hours = 24;

    // Update the numbers in clockBase:
    // Seconds:
    this.clock[0] = seconds / 60;
    // Minutes:
    this.clock[1] = minutes / 60;
    // Hours:
    this.clock[2] = hours / 24;

    let date = new Date();
    let secondsOfDay = ((date.getTime() % 86400000 - date.getTimezoneOffset() * 60000) / 1000);

    // let secondsOfDay = seconds + minutes * 60 + hours * 360;
    for (let i = 0; i < this.numOfMod; i++) {
      this.modValues[i] = (secondsOfDay % this.modModulo[i]) / this.modModulo[i];
      if (this.modValues[i] === 0) this.modValues[i] = this.modModulo[i];
    }
  }

  /*****************************************************************************************************************************************
   * DRAW */
  public draw(): void {
    this.drawBackground();
    this.drawClock();
    this.drawFib();
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawClock(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;

    // Seconds:
    ctx.lineWidth = this.secondsWidth * 4 / 5;
    ctx.beginPath();
    ctx.arc(this.screenWidth / 2, this.screenHeight / 2, this.secondsRadius, -Math.PI / 2, 2 * Math.PI * this.clock[0] - Math.PI / 2);
    ctx.stroke();
    // Minutes:
    ctx.lineWidth = this.minutesWidth * 4 / 5;
    ctx.beginPath();
    ctx.arc(this.screenWidth / 2, this.screenHeight / 2, this.minutesRadius, -Math.PI / 2, 2 * Math.PI * this.clock[1] - Math.PI / 2);
    ctx.stroke();
    // Hours:
    ctx.lineWidth = this.hoursWidth * 4 / 5;
    ctx.beginPath();
    ctx.arc(this.screenWidth / 2, this.screenHeight / 2, this.hoursRadius, -Math.PI / 2, 2 * Math.PI * this.clock[2] - Math.PI / 2);
    ctx.stroke();
  }

  private drawFib(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;

    // ctx.lineWidth = this.fibWidth;
    ctx.lineWidth = this.modElementWidth / 2;

    for (let i = 0; i < this.numOfMod; i++) {
      ctx.beginPath();
      ctx.arc(this.screenWidth / 2, this.screenHeight / 2, this.modBaseRadius + i * this.modElementWidth, -Math.PI / 2, 2 * Math.PI * this.modValues[i] - Math.PI / 2);
      ctx.stroke();
    }
  }

  /*****************************************************************************************************************************************
   * OTHER */


}




