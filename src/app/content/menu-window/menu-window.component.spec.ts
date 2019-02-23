import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuWindowComponent } from './menu-window.component';

describe('MenuWindowComponent', () => {
  let component: MenuWindowComponent;
  let fixture: ComponentFixture<MenuWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
