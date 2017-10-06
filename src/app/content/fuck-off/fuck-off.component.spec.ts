import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuckOffComponent } from './fuck-off.component';

describe('FuckOffComponent', () => {
  let component: FuckOffComponent;
  let fixture: ComponentFixture<FuckOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuckOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuckOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
