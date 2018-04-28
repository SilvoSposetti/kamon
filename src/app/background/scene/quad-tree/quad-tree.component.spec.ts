import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadTreeComponent } from './quad-tree.component';

describe('QuadTreeComponent', () => {
  let component: QuadTreeComponent;
  let fixture: ComponentFixture<QuadTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuadTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuadTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
