import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSceneComponent } from './start-scene.component';

describe('StartSceneComponent', () => {
  let component: StartSceneComponent;
  let fixture: ComponentFixture<StartSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
