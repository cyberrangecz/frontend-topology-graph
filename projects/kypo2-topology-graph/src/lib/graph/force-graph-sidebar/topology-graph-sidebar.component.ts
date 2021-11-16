import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
/**
 * Component of navigational bar
 */
@Component({
  selector: 'kypo2-topology-graph-sidebar',
  templateUrl: './topology-graph-sidebar.component.html',
  styleUrls: ['./topology-graph-sidebar.component.css'],
})
export class TopologyGraphSidebarComponent implements OnInit {
  displayDecorators: boolean;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.displayDecorators = this.configService.config.useDecorators;
  }
}
