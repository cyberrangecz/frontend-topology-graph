import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLinkLayerComponent } from './link-link-layer.component';

describe('LinkLinkLayerComponent', () => {
  let component: LinkLinkLayerComponent;
  let fixture: ComponentFixture<LinkLinkLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkLinkLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkLinkLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
