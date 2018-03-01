import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolarFunctionsComponent } from './polar-functions.component';

describe('PolarFunctionsComponent', () => {
  let component: PolarFunctionsComponent;
  let fixture: ComponentFixture<PolarFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolarFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolarFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
