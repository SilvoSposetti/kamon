import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingAlgorithmsComponent } from './sorting-algorithms.component';

describe('SortingAlgorithmsComponent', () => {
  let component: SortingAlgorithmsComponent;
  let fixture: ComponentFixture<SortingAlgorithmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingAlgorithmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingAlgorithmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
