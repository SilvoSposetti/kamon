import {Subject} from 'rxjs/Subject';
import {FpsService} from '../services/fps.service';
import {ColorService} from '../services/color.service';
import {ElementRef, ViewChild} from '@angular/core';

// Interface and abstract class used for initialisation, maintenance and termination of scenes.

export interface SceneInterface {

  setup(): void;

  update(): void;

  draw(): void;

}

export abstract class Scene implements SceneInterface {
  @ViewChild('myCanvas') canvasRef: ElementRef;

  public screenWidth: number;
  public screenHeight: number;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  public seaGradient: CanvasGradient;
  public sandGradient: CanvasGradient;

  constructor(public fpsService: FpsService, public colorService: ColorService) {

  }

  public setup() {
    console.log('default implementation of setup');
  }

  public update() {
    console.log('default implementation of update');
  }

  public draw() {
    console.log('default implementation of draw');
  }

  /*********************************************************************************************************************
   * CORE:
   */
  public initializeCore() {
    this.running = true;
    this.setupGradients();
    this.setup();
    this.fpsService.getFps().takeUntil(this.ngUnsubscribe).subscribe(value => {
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
 * Standard Template:
 */

//import {Component, Input, OnDestroy, OnInit} from '@angular/initializeCore';
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

//export class ********* extends Scene implements OnInit, OnDestroy{
//  @Input() screenWidth: number;
//  @Input() screenHeight: number;
//  @Input() showFPS: boolean;
//
//  constructor(public fpsService: FpsService, public colorService: ColorService) {
//    super(fpsService, colorService);
//  }
//
//  ngOnInit() {
//    this.initializeCore();
//  }
//
//  ngOnDestroy(): void {
//    this.terminateCore();
//  }
//
//  public setup(): void {
//
//  }
//
//  public update(): void {
//
//  }
//
//  public draw(): void {
//
//  }
//}




