import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkNodeLayerComponent } from './link-node-layer.component';

describe('LinkNodeLayerComponent', () => {
  let component: LinkNodeLayerComponent;
  let fixture: ComponentFixture<LinkNodeLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkNodeLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkNodeLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
