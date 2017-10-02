import {TestBed, inject} from '@angular/core/testing';

import {ScreenSizeService} from './screen-size.service';

describe('ScreenSizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenSizeService]
    });
  });

  it('should be created', inject([ScreenSizeService], (service: ScreenSizeService) => {
    expect(service).toBeTruthy();
  }));
});
