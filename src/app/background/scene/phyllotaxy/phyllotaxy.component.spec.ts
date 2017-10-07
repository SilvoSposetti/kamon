import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhyllotaxyComponent } from './phyllotaxy.component';

describe('PhyllotaxyComponent', () => {
  let component: PhyllotaxyComponent;
  let fixture: ComponentFixture<PhyllotaxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhyllotaxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhyllotaxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
