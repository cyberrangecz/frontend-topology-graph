import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Node, HostNode } from 'kypo2-topology-graph-model';

@Component({
  selector: '[lib-node-node-layer]',
  templateUrl: './node-node-layer.component.html',
  styleUrls: ['./node-node-layer.component.css']
})
export class NodeNodeLayerComponent implements OnChanges {
  @Input('lib-node-node-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() draggedNode: any;
  @Input() colors: boolean;

  nodeNodeZones = [];

  fill = 'blue';
  opacity = '0.2';
  filteredNodes = [];


  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    this.nodeNodeZones = [];
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      this.colorCheck();
      this.removeHosts();
      this.filteredNodes.forEach(node => {this.nodeNodeZones.push(this.calculateCollisionZones(node)); });
    }
    this.sendToDetection();
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }

  private calculateCollisionZones(node) {
    if (node != this.draggedNode) {
      const ax = node.x - this.nodeSize;
      const ay = node.y - this.nodeSize;
      const bx = 2 * this.nodeSize + ax;
      const by = node.y - this.nodeSize;
      const cx = 2 * this.nodeSize + ax;
      const cy = 2 * this.nodeSize + ay;
      const dx = node.x - this.nodeSize;
      const dy = 2 * this.nodeSize + ay;
      this.colZone = [[ax, ay], [bx, by], [cx, cy], [dx, dy]];
      this.sendToDetection();
      return ax + ',' + ay + ' ' + bx + ',' + by + ' ' + cx + ',' + cy + ' ' + dx + ',' + dy;
    }
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'blue';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  private removeHosts() {
    this.filteredNodes = this.nodes;
    if (this.draggedNode.children !== undefined) {
      this.nodes.forEach(node => {
          this.draggedNode.children.forEach(host => {
            if ((node == host && node instanceof HostNode) || (node == this.draggedNode)) {
              this.filteredNodes = this.filteredNodes.filter(item => item !== node);
            }
          });
      });
    }
  }
}

