import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

/* Provides observables for real-time screen width and height */

@Injectable()
export class ScreenSizeService {
  private width: Observable<number>;
  private height: Observable<number>;

  constructor() {
    let windowSize = createWindowSize();
    this.width = (windowSize.pluck('width') as Observable<number>).distinctUntilChanged();
    this.height = (windowSize.pluck('height') as Observable<number>).distinctUntilChanged();
  }

  getWidth(): Observable<number> {
    return this.width;
  }

  getHeight(): Observable<number> {
    return this.height;
  }

}

const createWindowSize = () =>
  Observable.fromEvent(window, 'resize')
    .map(getWindowSize)
    .startWith(getWindowSize())
    .publishReplay(1)
    .refCount();

const getWindowSize = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};
