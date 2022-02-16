import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyPageComponent } from './topology-page.component';

describe('TopologyPageComponent', () => {
  let component: TopologyPageComponent;
  let fixture: ComponentFixture<TopologyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopologyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
