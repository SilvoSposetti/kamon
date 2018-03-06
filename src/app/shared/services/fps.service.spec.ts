import { TestBed, inject } from '@angular/core/testing';

import { FpsService } from './fps.service';

describe('FpsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FpsService]
    });
  });

  it('should be created', inject([FpsService], (service: FpsService) => {
    expect(service).toBeTruthy();
  }));
});
