import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColZoneLayerComponent } from './col-zone-layer.component';

describe('ColZoneLayerComponent', () => {
  let component: ColZoneLayerComponent;
  let fixture: ComponentFixture<ColZoneLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColZoneLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColZoneLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
