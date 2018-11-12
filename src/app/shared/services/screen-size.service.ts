import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, pluck, publishReplay, refCount, startWith} from 'rxjs/operators';
import {fromEvent} from "rxjs/internal/observable/fromEvent";

/* Provides observables for real-time screen width and height */

@Injectable()
export class ScreenSizeService {
  private width: Observable<number>;
  private height: Observable<number>;

  constructor() {
    let windowSize = createWindowSize();
    this.width = (windowSize.pipe(pluck('width'))).pipe(distinctUntilChanged()) as Observable<number>;
    this.height = (windowSize.pipe(pluck('height'))).pipe(distinctUntilChanged()) as Observable<number>;
  }

  getWidth(): Observable<number> {
    return this.width;
  }

  getHeight(): Observable<number> {
    return this.height;
  }

}

const createWindowSize = () =>
  fromEvent(window, 'resize').pipe(
    map(getWindowSize)).pipe(
    startWith(getWindowSize())).pipe(
    publishReplay(1)).pipe(
    refCount());

const getWindowSize = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};
