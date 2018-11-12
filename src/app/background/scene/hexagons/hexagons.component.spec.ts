import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexagonsComponent } from './hexagons.component';

describe('HexagonsComponent', () => {
  let component: HexagonsComponent;
  let fixture: ComponentFixture<HexagonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexagonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexagonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
