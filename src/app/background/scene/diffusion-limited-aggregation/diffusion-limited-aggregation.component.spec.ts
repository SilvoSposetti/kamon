import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffusionLimitedAggregationComponent } from './diffusion-limited-aggregation.component';

describe('DiffusionLimitedAggregationComponent', () => {
  let component: DiffusionLimitedAggregationComponent;
  let fixture: ComponentFixture<DiffusionLimitedAggregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffusionLimitedAggregationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffusionLimitedAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
