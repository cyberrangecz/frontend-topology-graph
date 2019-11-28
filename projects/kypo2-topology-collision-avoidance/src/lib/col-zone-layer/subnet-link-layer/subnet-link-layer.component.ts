import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Link, Node, HostNode } from 'kypo2-topology-graph-model';
import { angularMath } from 'angular-ts-math';
@Component({
  selector: '[lib-subnet-link-layer]',
  templateUrl: './subnet-link-layer.component.html',
  styleUrls: ['./subnet-link-layer.component.css']
})
export class SubnetLinkLayerComponent implements OnChanges {
  @Input('lib-subnet-link-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() links: Link[];
  @Input() colors: boolean;
  @Input() draggedNode: any;

  subnetLinkZones = [];
  filteredNodes = [];
  boundedNodes = [];
  a = {
    x: 0,
    y: 0
  };
  b = {
    x: 0,
    y: 0
  };
  c = {
    x: 0,
    y: 0
  };
  d = {
    x: 0,
    y: 0
  };
  box = {
    a : this.a,
    b : this.b,
    c: this.c,
    d: this.d
  };
  fill = 'cyan';
  opacity = '0.2';

  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    this.subnetLinkZones = [];
    this.filteredNodes = [];
    this.boundedNodes = [];
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      this.calculateBoundingBox();
      this.colorCheck();
    }
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'cyan';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }

  private calculateVerticesDistance(link: Link) {
    let polygon: string;
    //link vector
    let a = link.target.x - link.source.x;
    let b = link.target.y - link.source.y;

    //normal vector
    a = [b, b = a][0];
    a = a * (-1);

    //c parameter
    const c = (-1) * ( a * link.source.x + b * link.source.y );

    //source vertices
    const sourceA = {
      'x' : link.source.x - this.box.a.x,
      'y' : link.source.y - this.box.a.y
    };
    const sourceB = {
      'x' : link.source.x - this.box.b.x,
      'y' : link.source.y - this.box.b.y
    };
    const sourceC = {
      'x' : link.source.x - this.box.c.x,
      'y' : link.source.y - this.box.c.y
    };
    const sourceD = {
      'x' : link.source.x - this.box.d.x,
      'y' : link.source.y - this.box.d.y
    };

    //target vertices
    const targetA = {
      'x' : link.target.x - this.box.a.x,
      'y' : link.target.y - this.box.a.y
    };
    const targetB = {
      'x' : link.target.x - this.box.b.x,
      'y' : link.target.y - this.box.b.y
    };
    const targetC = {
      'x' : link.target.x - this.box.c.x,
      'y' : link.target.y - this.box.c.y
    };
    const targetD = {
      'x' : link.target.x - this.box.d.x,
      'y' : link.target.y - this.box.d.y
    };

    const sourceVertices = {
      'a' : sourceA,
      'b' : sourceB,
      'c' : sourceC,
      'd' : sourceD
    };

    const targetVertices = {
      'a' : targetA,
      'b' : targetB,
      'c' : targetC,
      'd' : targetD
    };
    //calculate distance between points of box and link

    const coordsA = {
      'x' : link.source.x - ( this.nodeSize / 2 ),
      'y' : link.source.y - ( this.nodeSize / 2 ),

    };
    const coordsB = {
      'x' : link.source.x + ( this.nodeSize / 2 ),
      'y' : link.source.y - ( this.nodeSize / 2 ),

    };

    const aToVectorDistance = angularMath.absoluteOfNumber(((a * coordsA.x) + (b * coordsA.y) + c) / angularMath.squareOfNumber(angularMath.powerOfNumber(a, 2) + angularMath.powerOfNumber(b, 2)));
    const bToVectorDistance = angularMath.absoluteOfNumber(((a * coordsB.x) + (b * coordsB.y) + c) / angularMath.squareOfNumber(angularMath.powerOfNumber(a, 2) + angularMath.powerOfNumber(b, 2)));

    //if aToVectorDistance > bToVectorDistance we choose polygon As, At, Bt, Ct, Cs, Ds or As, At, Dt, Ct, Cs, Bs

    if (aToVectorDistance > bToVectorDistance) {
      const bToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.b.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.b.y - link.target.y, 2)));
      const dToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.d.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.d.y - link.target.y, 2)));
      if (bToNodeDistance > dToNodeDistance) {
        this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [targetVertices.a.x, targetVertices.a.y], [targetVertices.d.x, targetVertices.d.y], [targetVertices.c.x, targetVertices.c.y], [sourceVertices.c.x, sourceVertices.c.y], [sourceVertices.b.x, sourceVertices.b.y]];
        polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + targetVertices.a.x + ',' + targetVertices.a.y + ' ' + targetVertices.d.x + ',' + targetVertices.d.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + sourceVertices.c.x + ',' + sourceVertices.c.y + ' ' + sourceVertices.b.x + ',' + sourceVertices.b.y;
      } else {
        this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [targetVertices.a.x, targetVertices.a.y], [targetVertices.b.x, targetVertices.b.y], [targetVertices.c.x, targetVertices.c.y], [sourceVertices.c.x, sourceVertices.c.y], [sourceVertices.d.x, sourceVertices.d.y]];
        polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + targetVertices.a.x + ',' + targetVertices.a.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + sourceVertices.c.x + ',' + sourceVertices.c.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y;
      }
      this.sendToDetection();
      return polygon;
    }

    //if aToVectorDistance > bToVectorDistance we choose polygon Bs, Bt, Ct, Dt, Ds, As or Bs, Bt, At, Dt, Ds, Cs

    if (aToVectorDistance < bToVectorDistance) {
      const aToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.a.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.a.y - link.target.y, 2)));
      const cToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.c.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.c.y - link.target.y, 2)));
      if (aToNodeDistance > cToNodeDistance) {
        this.colZone = [[sourceVertices.b.x, sourceVertices.b.y], [targetVertices.b.x, targetVertices.b.y], [targetVertices.c.x, targetVertices.c.y], [targetVertices.d.x, targetVertices.d.y], [sourceVertices.d.x, sourceVertices.d.y], [sourceVertices.a.x, sourceVertices.a.y]];
        polygon = sourceVertices.b.x + ',' + sourceVertices.b.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + targetVertices.d.x + ',' + targetVertices.d.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y + ' ' + sourceVertices.a.x + ',' + sourceVertices.a.y;
      } else {
        this.colZone = [[sourceVertices.b.x, sourceVertices.b.y], [targetVertices.b.x, targetVertices.b.y], [targetVertices.a.x, targetVertices.a.y], [targetVertices.d.x, targetVertices.d.y], [sourceVertices.d.x, sourceVertices.d.y], [sourceVertices.c.x, sourceVertices.c.y]];
        polygon = sourceVertices.b.x + ',' + sourceVertices.b.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.a.x + ',' + targetVertices.a.y + ' ' + targetVertices.d.x + ',' + targetVertices.d.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y + ' ' + sourceVertices.c.x + ',' + sourceVertices.c.y;
      }
      this.sendToDetection();
      return polygon;
    }

    //check which coordinate is equal and so differentiate between nodes displayed directly above/under and beside
    if (link.source.x != link.target.x) {
      const aToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.a.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.a.y - link.target.y, 2)));
      const bToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.b.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.b.y - link.target.y, 2)));
      if (aToNodeDistance > bToNodeDistance) {
        this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [targetVertices.b.x, targetVertices.b.y], [targetVertices.c.x, targetVertices.c.y], [sourceVertices.d.x, sourceVertices.d.y]];
        polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y;
      } else {
        this.colZone = [[sourceVertices.b.x, sourceVertices.b.y], [sourceVertices.c.x, sourceVertices.c.y], [targetVertices.d.x, targetVertices.d.y], [targetVertices.a.x, targetVertices.a.y]];
        polygon = sourceVertices.b.x + ',' + sourceVertices.b.y + ' ' + sourceVertices.c.x + ',' + sourceVertices.c.y + ' ' + targetVertices.d.x + ',' + targetVertices.d.y + ' ' + targetVertices.a.x + ',' + targetVertices.a.y;
      }
      this.sendToDetection();
      return polygon;
    } else {
      const aToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.a.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.a.y - link.target.y, 2)));
      const dToNodeDistance = (angularMath.squareOfNumber(angularMath.powerOfNumber(sourceVertices.d.x - link.target.x, 2) + angularMath.powerOfNumber(sourceVertices.d.y - link.target.y, 2)));

      if (aToNodeDistance > dToNodeDistance) {
        this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [targetVertices.b.x, targetVertices.b.y], [targetVertices.c.x, targetVertices.c.y], [sourceVertices.d.x, sourceVertices.d.y]];
        polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y;
      } else {
        this.colZone = [[sourceVertices.d.x, sourceVertices.d.y], [targetVertices.a.x, targetVertices.a.y], [targetVertices.b.x, targetVertices.b.y], [sourceVertices.c.x, sourceVertices.c.y]];
        polygon = sourceVertices.d.x + ',' + sourceVertices.d.y + ' ' + targetVertices.a.x + ',' + targetVertices.a.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + sourceVertices.c.x + ',' + sourceVertices.c.y;
      }
      this.sendToDetection();
      return polygon;
    }
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
      this.box.a = {
        x : extremes.minX - this.draggedNode.x,
        y : extremes.minY - this.draggedNode.y,
      };
      this.box.b = {
        x : extremes.maxX - this.draggedNode.x,
        y : extremes.minY - this.draggedNode.y,
      };
      this.box.c = {
        x: extremes.maxX - this.draggedNode.x,
        y: extremes.maxY - this.draggedNode.y,
      };
      this.box.d = {
        x : extremes.minX - this.draggedNode.x,
        y : extremes.maxY - this.draggedNode.y
      };
      this.subnetLinkZones = [];
      for (const link of this.links) {
        if ((link.source != this.draggedNode) && (link.target != this.draggedNode)) {
          this.subnetLinkZones.push(this.calculateVerticesDistance(link));
        }
      }
    }
  }
}
