import {Component, Input, OnInit} from '@angular/core';
import {ICONS_PATH} from "../icons-path";

@Component({
  selector: 'kypo2-topology-app-legend',
  templateUrl: './kypo2-topology-legend.component.html',
  styleUrls: ['./kypo2-topology-legend.component.css']
})
export class Kypo2TopologyLegendComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  @Input() legendAttachment: string = "horizontal";

  iconsPath = ICONS_PATH;
  iconsMargin: string;
  titleMargin: string;

  nodeNames = [
    {icon: 'desktop', name: 'Host'},
    {icon: 'router', name: 'Router'},
    {icon: 'switch', name: 'Switch'},
    {icon: 'cloud', name: 'Hidden subnet'},
    {icon: 'internet', name: 'Internet'}
  ];

  constructor() { }

  ngOnInit(): void {
    this.setIconsFloating();
  }

  setIconsFloating(): void {
    if (this.legendAttachment === "vertical") {
      this.iconsMargin = '10px 0 0 0';
      this.titleMargin = '0';
    } else {
      this.iconsMargin = '0 15px 0 0';
      this.titleMargin = '0 10px 0 0';
    }
  }

}
