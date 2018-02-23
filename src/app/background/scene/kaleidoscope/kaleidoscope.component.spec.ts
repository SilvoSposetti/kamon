import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaleidoscopeComponent } from './kaleidoscope.component';

describe('KaleidoscopeComponent', () => {
  let component: KaleidoscopeComponent;
  let fixture: ComponentFixture<KaleidoscopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaleidoscopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaleidoscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
