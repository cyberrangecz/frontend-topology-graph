import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.service';
/**
 * Component of navigational bar
 */
@Component({
  selector: 'app-force-graph-sidebar',
  templateUrl: './force-graph-sidebar.component.html',
  styleUrls: ['./force-graph-sidebar.component.css'],
})
export class ForceGraphSidebarComponent implements OnInit {

  displayDecorators: boolean;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.displayDecorators = this.configService.config.useDecorators;
  }

}
