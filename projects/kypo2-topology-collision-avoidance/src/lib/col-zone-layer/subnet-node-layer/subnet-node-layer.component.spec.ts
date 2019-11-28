import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetNodeLayerComponent } from './subnet-node-layer.component';

describe('SubnetNodeLayerComponent', () => {
  let component: SubnetNodeLayerComponent;
  let fixture: ComponentFixture<SubnetNodeLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubnetNodeLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnetNodeLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
