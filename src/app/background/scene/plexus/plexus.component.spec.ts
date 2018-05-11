import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlexusComponent } from './plexus.component';

describe('PlexusComponent', () => {
  let component: PlexusComponent;
  let fixture: ComponentFixture<PlexusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlexusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlexusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
