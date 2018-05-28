import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpsComponent } from './fps.component';

describe('FpsComponent', () => {
  let component: FpsComponent;
  let fixture: ComponentFixture<FpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
