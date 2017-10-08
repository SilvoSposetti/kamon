import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerlinFieldComponent } from './perlin-field.component';

describe('PerlinFieldComponent', () => {
  let component: PerlinFieldComponent;
  let fixture: ComponentFixture<PerlinFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerlinFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerlinFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
