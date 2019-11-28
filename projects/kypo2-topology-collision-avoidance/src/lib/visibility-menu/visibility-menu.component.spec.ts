import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityMenuComponent } from './visibility-menu.component';

describe('VisibilityMenuComponent', () => {
  let component: VisibilityMenuComponent;
  let fixture: ComponentFixture<VisibilityMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilityMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
