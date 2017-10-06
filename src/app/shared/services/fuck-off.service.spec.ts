import { TestBed, inject } from '@angular/core/testing';

import { FuckOffService } from './fuck-off.service';

describe('FuckOffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuckOffService]
    });
  });

  it('should be created', inject([FuckOffService], (service: FuckOffService) => {
    expect(service).toBeTruthy();
  }));
});
