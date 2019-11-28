import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Link, Node } from 'kypo2-topology-graph-model';
import { angularMath } from 'angular-ts-math';

@Component({
  selector: '[lib-node-link-layer]',
  templateUrl: './node-link-layer.component.html',
  styleUrls: ['./node-link-layer.component.css']
})
export class NodeLinkLayerComponent implements OnChanges {
  @Input('lib-node-link-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() links: Link[];
  @Input() colors: boolean;
  @Input() draggedNode: Node;

  nodeLinkZones = [];
  fill = 'red';
  opacity = '0.2';

  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      this.calculateColZones();
      this.colorCheck();
    } else {
      this.nodeLinkZones = [];
    }
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'red';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }

  private calculateColZones() {
    this.nodeLinkZones = [];
    for (const link of this.links) {
      if ((link.source != this.draggedNode) && (link.target != this.draggedNode)) {
        this.nodeLinkZones.push(this.calculateVerticesDistance(link));
      }
    }
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
      'x' : link.source.x - ( this.nodeSize / 2 ),
      'y' : link.source.y - ( this.nodeSize / 2 ),
      'distance' : 0
    };
    const sourceB = {
      'x' : link.source.x + ( this.nodeSize / 2 ),
      'y' : link.source.y - ( this.nodeSize / 2 ),
      'distance' : 0
    };
    const sourceC = {
      'x' : link.source.x + ( this.nodeSize / 2 ),
      'y' : link.source.y + ( this.nodeSize / 2 ),
      'distance' : 0
    };
    const sourceD = {
      'x' : link.source.x - ( this.nodeSize / 2 ),
      'y' : link.source.y + ( this.nodeSize / 2 ),
      'distance' : 0
    };

    //target vertices
    const targetA = {
      'x' : link.target.x - ( this.nodeSize / 2 ),
      'y' : link.target.y - ( this.nodeSize / 2 ),
      'distance' : 0
    };
    const targetB = {
      'x' : link.target.x + ( this.nodeSize / 2 ),
      'y' : link.target.y - ( this.nodeSize / 2 ),
      'distance' : 0
    };
    const targetC = {
      'x' : link.target.x + ( this.nodeSize / 2 ),
      'y' : link.target.y + ( this.nodeSize / 2 ),
      'distance' : 0
    };
    const targetD = {
      'x' : link.target.x - ( this.nodeSize / 2 ),
      'y' : link.target.y + ( this.nodeSize / 2 ),
      'distance' : 0
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

    //ax + by + c / sqrt( pwr(a) + pwr(b) ) = | vertice, line |

    sourceVertices.a.distance = angularMath.absoluteOfNumber(((a * sourceVertices.a.x) + (b * sourceVertices.a.y) + c) / angularMath.squareOfNumber(angularMath.powerOfNumber(a, 2) + angularMath.powerOfNumber(b, 2)));
    sourceVertices.b.distance = angularMath.absoluteOfNumber(((a * sourceVertices.b.x) + (b * sourceVertices.b.y) + c) / angularMath.squareOfNumber(angularMath.powerOfNumber(a, 2) + angularMath.powerOfNumber(b, 2)));

    //if a.distance > b.distance we choose polygon As, At, Ct, Cs

    if (sourceVertices.a.distance > sourceVertices.b.distance) {
      this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [targetVertices.a.x, targetVertices.a.y], [targetVertices.c.x, targetVertices.c.y], [sourceVertices.c.x, sourceVertices.c.y], link];
      this.sendToDetection();
      polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + targetVertices.a.x + ',' + targetVertices.a.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + sourceVertices.c.x + ',' + sourceVertices.c.y;
      return  polygon;
    }
    if (sourceVertices.a.distance < sourceVertices.b.distance) {
      this.colZone = [[sourceVertices.b.x, sourceVertices.b.y], [targetVertices.b.x, targetVertices.b.y], [targetVertices.d.x, targetVertices.d.y], [sourceVertices.d.x, sourceVertices.d.y], link];
      this.sendToDetection();
      polygon = sourceVertices.b.x + ',' + sourceVertices.b.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.d.x + ',' + targetVertices.d.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y;
      return  polygon;
    }
    if (sourceVertices.a.distance == sourceVertices.b.distance) {
      if (link.source.x == link.target.x) {
        this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [sourceVertices.b.x, sourceVertices.b.y], [targetVertices.c.x, targetVertices.c.y], [targetVertices.d.x, targetVertices.d.y], link];
        this.sendToDetection();
        polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + sourceVertices.b.x + ',' + sourceVertices.b.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + targetVertices.d.x + ',' + targetVertices.d.y;
        console.log(polygon);
        return  polygon;
      } else {
        this.colZone = [[sourceVertices.a.x, sourceVertices.a.y], [targetVertices.a.x, targetVertices.a.y], [targetVertices.b.x, targetVertices.b.y], [sourceVertices.b.x, sourceVertices.b.y], link];
        this.sendToDetection();
        polygon = sourceVertices.a.x + ',' + sourceVertices.a.y + ' ' + targetVertices.b.x + ',' + targetVertices.b.y + ' ' + targetVertices.c.x + ',' + targetVertices.c.y + ' ' + sourceVertices.d.x + ',' + sourceVertices.d.y;
        console.log(polygon);
        return  polygon;
      }
    }
  }
}
