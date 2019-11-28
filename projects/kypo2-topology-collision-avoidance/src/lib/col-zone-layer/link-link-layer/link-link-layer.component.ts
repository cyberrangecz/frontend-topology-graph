import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Link, Node, HostNode } from 'kypo2-topology-graph-model';

@Component({
  selector: '[lib-link-link-layer]',
  templateUrl: './link-link-layer.component.html',
  styleUrls: ['./link-link-layer.component.css']
})
export class LinkLinkLayerComponent implements OnChanges {
  @Input('lib-link-link-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() links: Link[];
  @Input() draggedNode: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() colors: boolean;

  linkLinkZones = [];

  viableLinks = [];
  anchorNodes = [];
  fill = 'orange';
  opacity = '0.2';

  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      this.chooseLinksAndAnchors();
      this.colorCheck();
    } else {
      this.linkLinkZones = [];
    }
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'orange';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }

  private calculateColZone(anchor: Node, link: Link) {
    const first = {
      'x' : link.source.x,
      'y' : link.source.y
    };
    const second = {
      'x' : link.target.x,
      'y' : link.target.y
    };
    const fourth = {
      'x' : (first.x - anchor.x) * this.width * this.height,
      'y' : (first.y - anchor.y) * this.width * this.height
    };
    const third = {
      'x' : (second.x - anchor.x) * this.width * this.height,
      'y' : (second.y - anchor.y) * this.width * this.height
    };
    // divide coordinations until 5 digits
    while ((fourth.x > 99999) || (fourth.x < -99999)) {
      fourth.x /= 2;
      fourth.y /= 2;
    }
    while ((fourth.y > 99999) || (fourth.y < -99999)) {
      fourth.x /= 2;
      fourth.y /= 2;
    }
    while ((third.x > 99999) || (third.x < -99999)) {
      third.x /= 2;
      third.y /= 2;
    }
    while ((third.y > 99999) || (third.y < -99999)) {
      third.x /= 2;
      third.y /= 2;
    }
    this.colZone = [[first.x, first.y], [second.x, second.y], [third.x, third.y], [fourth.x, fourth.y]];
    this.sendToDetection();
    const polygon = first.x + ',' + first.y + ' ' + second.x + ',' + second.y + ' ' + third.x + ',' + third.y + ' ' + fourth.x + ',' + fourth.y;
    this.linkLinkZones.push(polygon);
  }

  private chooseLinksAndAnchors() {
    this.linkLinkZones = [];
    if (this.draggedNode != null) {
      this.viableLinks = [];
      this.anchorNodes = [];
      // choose anchor nodes
      for (const node of this.nodes) {
        if (node != this.draggedNode) {
          let connected = false;
          for (const link of this.links) {
            if ((link.source == this.draggedNode && link.target == node) || (link.source == node && link.target == this.draggedNode)) {
              connected = true;
            }
          }
          if (connected == true && !(node instanceof HostNode)) {
            this.anchorNodes.push(node);
          }
        }
      }
      // choose viable links
      for (const node of this.anchorNodes) {
        this.viableLinks = [];
        for (const link of this.links) {
          if (link.target != node && link.source != node && link.source != this.draggedNode && link.target != this.draggedNode) {
            this.calculateColZone(node, link);
          }
        }
      }
    }
  }
}
