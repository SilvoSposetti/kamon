import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoronoiComponent } from './voronoi.component';

describe('VoronoiComponent', () => {
  let component: VoronoiComponent;
  let fixture: ComponentFixture<VoronoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoronoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoronoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
