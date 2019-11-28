import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Link, Node } from 'kypo2-topology-graph-model';
import {Subscription} from 'rxjs';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: '[lib-col-zone-layer]',
  templateUrl: './col-zone-layer.component.html',
  styleUrls: ['./col-zone-layer.component.css']
})
export class ColZoneLayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input('lib-col-zone-layer') dummy: any;
  @Input() nodes: Node[];
  @Input() links: Link[];
  @Input() width: number;
  @Input() height: number;
  @Input() draggedNode: Node;
  @Input() nodeSize: number;

  nodeToNode: boolean;
  nodeToLink: boolean;
  linkToNode: boolean;
  linkToLink: boolean;
  subnetToNode: boolean;
  subnetToLink: boolean;
  linkToHost: boolean;
  colors: boolean;
  collisionZones: any[];
  previousNode: Node;
  now: Date;

  private subscriptions: Subscription[] = [];

  constructor(private data: SettingsService) { }

  ngOnInit() {
    this.subscriptions = [
        this.data.getNodeToNode().subscribe(nodeToNode => this.nodeToNode = nodeToNode),
        this.data.getNodeToLink().subscribe(nodeToLink => this.nodeToLink = nodeToLink),
        this.data.getLinkToNode().subscribe(linkToNode => this.linkToNode = linkToNode),
        this.data.getLinkToLink().subscribe(linkToLink => this.linkToLink = linkToLink),
        this.data.getSubnetToNode().subscribe(subnetToNode => this.subnetToNode = subnetToNode),
        this.data.getSubnetToLink().subscribe(subnetToLink => this.subnetToLink = subnetToLink),
        this.data.getLinkToHost().subscribe(linkToHost => this.linkToHost = linkToHost),
        this.data.getColors().subscribe(colors => this.colors = colors)
    ];
    this.previousNode = null;
  }

  receiveColZone($event) {
    this.collisionZones.push($event);
  }

  ngOnChanges() {
    if (this.draggedNode == null && this.previousNode != null) {
      let collision;
      collision = false;

      this.collisionZones.forEach(zone => {
        if (this.pointInPolygon(zone, this.previousNode.x, this.previousNode.y) == true) {collision = true }
      });
    }
    if (this.draggedNode != null) {
      this.previousNode = this.draggedNode;
    }
    this.collisionZones = [];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  private pointInPolygon(zone, x, y) {
    let collision = false;
    for (let i = 0, j = zone.length - 1; i < zone.length; j = i++) {
        let xi = zone[i][0];
        let yi = zone[i][1];
        let xj = zone[j][0];
        let yj = zone[j][1];
        let check = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (check) { collision = !collision; }
    }
    return collision;
  }

  private getTime() {
    this.now = new Date();
    const time: Array<String> = [ String(this.now.getHours()), String(this.now.getMinutes()), String(this.now.getSeconds())];
    for (let i of time) {
        if ( Number(i) < 10 ) {
          i = '0' + i;
        }
    }
    return time[0] + ':' + time[1] + ':' + time[2];
  }
}
