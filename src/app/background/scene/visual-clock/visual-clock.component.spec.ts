import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualClockComponent } from './visual-clock.component';

describe('VisualClockComponent', () => {
  let component: VisualClockComponent;
  let fixture: ComponentFixture<VisualClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
