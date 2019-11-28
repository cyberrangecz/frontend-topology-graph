import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeNodeLayerComponent } from './node-node-layer.component';

describe('NodeNodeLayerComponent', () => {
  let component: NodeNodeLayerComponent;
  let fixture: ComponentFixture<NodeNodeLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeNodeLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeNodeLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
