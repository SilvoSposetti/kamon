import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LissajousComponent } from './lissajous.component';

describe('LissajousComponent', () => {
  let component: LissajousComponent;
  let fixture: ComponentFixture<LissajousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LissajousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LissajousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
