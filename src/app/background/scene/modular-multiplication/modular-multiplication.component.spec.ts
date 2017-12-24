import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularMultiplicationComponent } from './modular-multiplication.component';

describe('ModularMultiplicationComponent', () => {
  let component: ModularMultiplicationComponent;
  let fixture: ComponentFixture<ModularMultiplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModularMultiplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularMultiplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
