import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FpsService {

  private fpsCounter: number;
  private now: number;
  private deltaTime: number;

  private currentFps: number; // this is a mean over the last 'updateCurrentFpsTime' amount of milliseconds.
  private currentFpsTime: number;
  private updateCurrentFpsTimeMilliseconds: number = 500; // milliseconds between each update interval.
  private amountOfFpsInAllottedTime: number;

  private overallMeanFps: number = 0; // this is a mean over all frames.
  private overallMeanFpsFloored: number = 0; // just the floored version.

  private fpsSubject = new Subject<number[]>();


  constructor() {
    this.reset();
  }

  public reset(): void {
    this.fpsCounter = 0;
    this.now = new Date().getTime();
    this.currentFpsTime = this.now;
    this.deltaTime = 1;
    this.currentFps = 1;
    this.overallMeanFpsFloored = 0;
    this.overallMeanFps = 0;
    this.amountOfFpsInAllottedTime = 0;
    this.fpsSubject.next([this.currentFps, this.overallMeanFpsFloored]);

  }

  public updateFps(): void {
    let newNow = new Date().getTime();
    this.deltaTime = newNow - this.now;
    this.now = newNow;

    if (this.fpsCounter > 0) {
      //Update overall average:
      this.overallMeanFps = ((this.overallMeanFps * this.fpsCounter) + (1000 / this.deltaTime)) / (this.fpsCounter + 1);
      this.overallMeanFpsFloored = Math.floor(this.overallMeanFps);
    }
    // update currentFps at each frame:
    this.currentFps = Math.floor(this.amountOfFpsInAllottedTime / (this.now - this.currentFpsTime) * 1000);
    if (newNow - this.currentFpsTime > this.updateCurrentFpsTimeMilliseconds || this.fpsCounter === 0) {
      this.amountOfFpsInAllottedTime = 0;
      this.currentFpsTime = this.now;
      this.fpsSubject.next([this.currentFps, this.overallMeanFpsFloored]);
    }
    this.fpsCounter++;
    this.amountOfFpsInAllottedTime++;
  }

  // used to display values on bottom right of the page.
  public getFps(): Observable<number[]> {
    return this.fpsSubject.asObservable();
  }
}
