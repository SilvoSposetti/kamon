import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefractionComponent } from './refraction.component';

describe('RefractionComponent', () => {
  let component: RefractionComponent;
  let fixture: ComponentFixture<RefractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
