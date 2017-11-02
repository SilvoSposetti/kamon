import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarmonicFunctionsComponent } from './harmonic-functions.component';

describe('HarmonicFunctionsComponent', () => {
  let component: HarmonicFunctionsComponent;
  let fixture: ComponentFixture<HarmonicFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarmonicFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarmonicFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
