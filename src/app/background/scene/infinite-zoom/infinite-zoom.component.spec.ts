import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteZoomComponent } from './infinite-zoom.component';

describe('InfiniteZoomComponent', () => {
  let component: InfiniteZoomComponent;
  let fixture: ComponentFixture<InfiniteZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfiniteZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
