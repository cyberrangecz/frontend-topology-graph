import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetLinkLayerComponent } from './subnet-link-layer.component';

describe('SubnetLinkLayerComponent', () => {
  let component: SubnetLinkLayerComponent;
  let fixture: ComponentFixture<SubnetLinkLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubnetLinkLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnetLinkLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
