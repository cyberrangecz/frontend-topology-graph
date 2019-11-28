import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Link, Node, HostNode } from 'kypo2-topology-graph-model';
import { angularMath } from 'angular-ts-math';

@Component({
  selector: '[lib-link-host-layer]',
  templateUrl: './link-host-layer.component.html',
  styleUrls: ['./link-host-layer.component.css']
})
export class LinkHostLayerComponent implements OnChanges {
  @Input('lib-link-host-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() links: Link[];
  @Input() colors: boolean;
  @Input() draggedNode: any;
  @Input() width: number;
  @Input() height: number;

  linkHostZones = [];
  routerNodes = [];
  hostNodes = [];

  fill = 'brown';
  opacity = '0.2';

  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    this.linkHostZones = [];
    this.routerNodes = [];
    this.hostNodes = [];
    if (this.draggedNode !== undefined && this.draggedNode != null && this.draggedNode.physicalRole == 'switch') {
      this.colorCheck();
      this.separateHosts();
      this.hostNodes.forEach(host => {
        this.calculateColZones(host);
      });
    }
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'brown';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  private separateHosts() {
    if (this.draggedNode.children !== undefined) {
      this.draggedNode.children.forEach(node => {
        if (node instanceof HostNode) {
          this.hostNodes.push(node);
        } else {
          this.routerNodes.push(node);
        }
      });
    }
  }

  private calculateColZones(host: Node) {
    const a = {
      'x' : host.x,
      'y' : host.y,
    };
    let b = {
      'x' : 0,
      'y' : 0,
      'alpha': 0
    };
    let c = {
      'x' : 0,
      'y' : 0,
      'alpha': 0
    };
    const draggedNodeA = {
      'x' : this.draggedNode.x - ( this.nodeSize / 2 ),
      'y' : this.draggedNode.y - ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const draggedNodeB = {
      'x' : this.draggedNode.x + ( this.nodeSize / 2 ),
      'y' : this.draggedNode.y - ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const draggedNodeC = {
      'x' : this.draggedNode.x + ( this.nodeSize / 2 ),
      'y' : this.draggedNode.y + ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const draggedNodeD = {
      'x' : this.draggedNode.x - ( this.nodeSize / 2 ),
      'y' : this.draggedNode.y + ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const draggedNodeVer = {
      'a': draggedNodeA,
      'b': draggedNodeB,
      'c': draggedNodeC,
      'd': draggedNodeD
    };

    for (const ver of [draggedNodeVer.a, draggedNodeVer.b, draggedNodeVer.c, draggedNodeVer.d]) {
      const y = angularMath.squareOfNumber(angularMath.powerOfNumber(this.draggedNode.x - a.x, 2) + angularMath.powerOfNumber(this.draggedNode.y - a.y, 2));
      const x = angularMath.squareOfNumber(angularMath.powerOfNumber(this.draggedNode.x - ver.x, 2) + angularMath.powerOfNumber(this.draggedNode.y - ver.y, 2));
      const z = angularMath.squareOfNumber(angularMath.powerOfNumber(ver.x - a.x, 2) + angularMath.powerOfNumber(ver.y - a.y, 2));

      ver.alpha = angularMath.acosNumber((angularMath.powerOfNumber(x, 2) - angularMath.powerOfNumber(y, 2) - angularMath.powerOfNumber(z, 2)) / ((-2) * y * z));
      if (ver.alpha > b.alpha) {
        c = b;
        b = ver;
      } else if (ver.alpha > c.alpha) {
        c = ver;
      }

    }
    b.x = b.x - a.x;
    b.y = b.y - a.y;

    c.x = c.x - a.x;
    c.y = c.y - a.y;

    this.routerNodes.forEach(router => {
      this.constructPolygon(router, b, c);
    });
  }

  private constructPolygon(router, b, c) {
    let bx = (b.x * this.width * this.height) + router.x;
    let by = (b.y * this.width * this.height) + router.x;
    let cx = (c.x * this.width * this.height) + router.x;
    let cy = (c.y * this.width * this.height) + router.x;

    // divide coordinations until 5 digits (svg considers 5 digit numbers "safe input")
    while ((bx > 99999) || (bx < -99999)) {
      bx /= 2;
      by /= 2;
    }
    while ((by > 99999) || (by < -99999)) {
      bx /= 2;
      by /= 2;
    }
    while ((cx > 99999) || (cx < -99999)) {
      cx /= 2;
      cy /= 2;
    }
    while ((cy > 99999) || (cy < -99999)) {
      cx /= 2;
      cy /= 2;
    }
    this.colZone = [[router.x, router.y], [bx, by], [cx, cy]];
    this.sendToDetection();
    const polygon = router.x + ',' + router.y + ' ' + bx + ',' + by + ' ' + cx + ',' + cy;
    this.linkHostZones.push(polygon);
  }
}
