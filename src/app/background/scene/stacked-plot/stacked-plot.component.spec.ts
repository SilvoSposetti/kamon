import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedPlotComponent } from './stacked-plot.component';

describe('StackedPlotComponent', () => {
  let component: StackedPlotComponent;
  let fixture: ComponentFixture<StackedPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
