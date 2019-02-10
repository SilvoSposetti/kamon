import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMenuComponent } from './default-menu.component';

describe('DefaultMenuComponent', () => {
  let component: DefaultMenuComponent;
  let fixture: ComponentFixture<DefaultMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
