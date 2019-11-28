import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Node, HostNode } from 'kypo2-topology-graph-model';

@Component({
  selector: '[lib-subnet-node-layer]',
  templateUrl: './subnet-node-layer.component.html',
  styleUrls: ['./subnet-node-layer.component.css']
})
export class SubnetNodeLayerComponent implements OnChanges {
  @Input('lib-subnet-node-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() draggedNode: any;
  @Input() colors: boolean;

  subnetNodeZones = [];

  fill = 'purple';
  opacity = '0.2';
  filteredNodes = [];
  boundedNodes = [];
  box = {
    x : 0,
    y : 0,
    width: 0,
    height: 0
  };

  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    this.subnetNodeZones = [];
    this.filteredNodes = [];
    this.boundedNodes = [];
    this.box = {
      x : 0,
      y : 0,
      width: 0,
      height: 0
    };
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      this.calculateBoundingBox();
      if (this.boundedNodes.length > 1) {
        this.filteredNodes.forEach(node => {
          this.subnetNodeZones.push(this.calculateCollisionZones(node));
        });
        this.colorCheck();
      }
    }
  }

  private calculateCollisionZones(node) {
    const ax = node.x - this.box.x - this.nodeSize / 2;
    const ay = node.y - this.box.y - this.nodeSize / 2;
    const bx = this.box.width + this.nodeSize + ax;
    const by = node.y - this.box.y - this.nodeSize / 2;
    const cx = this.box.width + this.nodeSize + ax;
    const cy = this.box.height + this.nodeSize + ay;
    const dx = node.x - this.box.x - this.nodeSize / 2;
    const dy = this.box.height + this.nodeSize + ay;
    this.colZone = [[ax, ay], [bx, by], [cx, cy], [dx, dy]];
    this.sendToDetection();
    return ax + ',' + ay + ' ' + bx + ',' + by + ' ' + cx + ',' + cy + ' ' + dx + ',' + dy;
  }

  private separateHosts() {
    this.filteredNodes = this.nodes;
    this.boundedNodes = [this.draggedNode];
    if (this.draggedNode.children !== undefined) {
      this.nodes.forEach(node => {
          this.draggedNode.children.forEach(host => {

            if (node == host && node instanceof HostNode) {
              this.filteredNodes = this.filteredNodes.filter(item => item !== node);
              this.boundedNodes.push(node);
            }
          });
      });
    }
    this.filteredNodes = this.filteredNodes.filter(item => item !== this.draggedNode);
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'purple';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }
    //calculate four vertices of node "icon"
  private getVertices(node: Node) {
    return [
      {
        x : node.x - this.nodeSize / 2,
        y : node.y - this.nodeSize / 2
      },
      {
        x : node.x - this.nodeSize / 2,
        y : node.y + this.nodeSize / 2
      },
      {
        x : node.x + this.nodeSize / 2,
        y : node.y - this.nodeSize / 2
      },
      {
        x : node.x + this.nodeSize / 2,
        y : node.y + this.nodeSize / 2
      }
    ];
  }

  private resizeBox(verticesList, extremes) {
    verticesList.forEach(vertice => {
      if (vertice.x > extremes.maxX) {
        extremes.maxX = vertice.x;
      }
      if (vertice.x < extremes.minX) {
        extremes.minX = vertice.x;
      }
      if (vertice.y > extremes.maxY) {
        extremes.maxY = vertice.y;
      }
      if (vertice.y < extremes.minY) {
        extremes.minY = vertice.y;
      }
    });
    return extremes;
  }

  private calculateBoundingBox() {
    this.separateHosts();
    if (this.boundedNodes.length > 1) {
      let extremes = {
        minX: this.boundedNodes[0].x,
        maxX: this.boundedNodes[0].x,
        minY: this.boundedNodes[0].y,
        maxY: this.boundedNodes[0].y
      };
      this.boundedNodes.forEach(node => {
        extremes = this.resizeBox(this.getVertices(node), extremes);
      });
      this.box = {
          x : extremes.maxX - this.draggedNode.x,
          y : extremes.maxY - this.draggedNode.y,
          width: extremes.maxX - extremes.minX,
          height: extremes.maxY - extremes.minY
      };
    }
  }

}
