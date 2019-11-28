import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHostLayerComponent } from './link-host-layer.component';

describe('LinkHostLayerComponent', () => {
  let component: LinkHostLayerComponent;
  let fixture: ComponentFixture<LinkHostLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkHostLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkHostLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
