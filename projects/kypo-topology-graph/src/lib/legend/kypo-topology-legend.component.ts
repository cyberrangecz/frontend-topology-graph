import { Component, Input, OnInit } from '@angular/core';
import { ICONS_PATH } from '../icons-path';

@Component({
  selector: 'kypo-topology-app-legend',
  templateUrl: './kypo-topology-legend.component.html',
  styleUrls: ['./kypo-topology-legend.component.css'],
})
export class KypoTopologyLegendComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() legendAttachment: string = 'horizontal';

  iconsPath = ICONS_PATH;
  iconsMargin: string;
  titleMargin: string;

  nodeNames = [
    { icon: 'desktop', name: 'Host' },
    { icon: 'router', name: 'Router' },
    { icon: 'switch', name: 'Switch' },
    { icon: 'cloud', name: 'Hidden subnet' },
    { icon: 'internet', name: 'Internet' },
    { icon: 'docker', name: 'Docker container' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.setIconsFloating();
  }

  setIconsFloating(): void {
    if (this.legendAttachment === 'vertical') {
      this.iconsMargin = '10px 0 0 0';
      this.titleMargin = '0';
    } else {
      this.iconsMargin = '0 15px 0 0';
      this.titleMargin = '0 10px 0 0';
    }
  }
}
