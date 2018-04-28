import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangtonsAntComponent } from './langtons-ant.component';

describe('LangtonsAntComponent', () => {
  let component: LangtonsAntComponent;
  let fixture: ComponentFixture<LangtonsAntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangtonsAntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangtonsAntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
