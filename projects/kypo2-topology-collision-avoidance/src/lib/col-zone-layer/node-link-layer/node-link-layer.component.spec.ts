import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLinkLayerComponent } from './node-link-layer.component';

describe('NodeLinkLayerComponent', () => {
  let component: NodeLinkLayerComponent;
  let fixture: ComponentFixture<NodeLinkLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeLinkLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeLinkLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
