import {Subject} from 'rxjs';
import {FpsService} from '../services/fps.service';
import {ColorService} from '../services/color.service';
import {ElementRef, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

// Abstract class used for initialisation, maintenance and termination of scenes.
export abstract class Scene implements AfterViewInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;

  public screenWidth: number;
  public screenHeight: number;

  public ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  public seaGradient: CanvasGradient;
  public sandGradient: CanvasGradient;
  public frameCount: number;

  constructor(public fpsService: FpsService, public colorService: ColorService) {

  }

  public abstract setup(): void;

  public abstract update(): void;

  public abstract draw(): void;

  ngAfterViewInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  /*********************************************************************************************************************
   * CORE:
   */
  public initialiseCore() {
    this.frameCount = 0;
    this.running = true;
    this.setupGradients();
    this.setup();
    this.fpsService.getFps().pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.fpsValues = value;
    });
    requestAnimationFrame(() => this.core());
  }

  private core() {
    this.update();
    this.draw();
    this.fpsService.updateFps();
    if (this.running) {
      requestAnimationFrame(() => this.core());
    }
    this.frameCount++;
  }

  public terminateCore() {
    this.running = false;
    this.fpsService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /*********************************************************************************************************************
   * Other:
   */
  private setupGradients() {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.seaGradient = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.seaGradient.addColorStop(0, this.colorService.getBackgroundFirstStopHEX());
    this.seaGradient.addColorStop(1, this.colorService.getBackgroundSecondStopHEX());

    this.sandGradient = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.sandGradient.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.sandGradient.addColorStop(1, this.colorService.getForegroundSecondStopHEX());

  }
}

/*********************************************************************************************************************
 * Standard Component-Scene Template:
 */

//import {Component, Input, OnDestroy, AfterViewInit} from '@angular/initialiseCore';
//import {FpsService} from '../../../shared/services/fps.service';
//import {ColorService} from '../../../shared/services/color.service';
//import {Scene} from '../../../shared/models/Scene';
//
//
//@Component({
//  selector: '*********',
//  templateUrl: './*********.html',
//  styleUrls: ['./*********.css']
//})

//export class ********* extends Scene implements AfterViewInit, OnDestroy{
//  @Input() screenWidth: number;
//  @Input() screenHeight: number;
//  @Input() showFPS: boolean;
//
//  constructor(public fpsService: FpsService, public colorService: ColorService) {
//    super(fpsService, colorService);
//  }
//
//  /*****************************************************************************************************************************************
//   * SETUP */
//  public setup(): void {
//
//  }
//
//  /*****************************************************************************************************************************************
//   * UPDATE */
//  public update(): void {
//
// }
//
// /*****************************************************************************************************************************************
//  * DRAW */
// public draw(): void {
//
//  }
//
//  /*****************************************************************************************************************************************
//   * OTHER */
//}




