import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Link, Node, HostNode } from 'kypo2-topology-graph-model';
import { angularMath } from 'angular-ts-math';

@Component({
  selector: '[lib-link-node-layer]',
  templateUrl: './link-node-layer.component.html',
  styleUrls: ['./link-node-layer.component.css']
})
export class LinkNodeLayerComponent implements OnChanges {
  @Input('lib-link-node-layer') dummy: any;
  @Input() nodeSize: number;
  @Input() nodes: Node[];
  @Input() links: Link[];
  @Input() draggedNode: any;
  @Input() width: number;
  @Input() height: number;
  @Input() colors: boolean;

  linkNodeZones = [];
  viableNodes = [];
  anchorNodes = [];
  tuplesList = [];
  filteredNodes = [];

  fill = 'green';
  opacity = '0.2';

  colZone = [];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor() { }

  ngOnChanges() {
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      this.chooseNodes();
      this.colorCheck();
    } else {
      this.linkNodeZones = [];
    }
  }

  private colorCheck() {
    if (this.colors == true) {
      this.fill = 'green';
      this.opacity = '0.2';
    } else {
      this.fill = '#e9dfcc';
      this.opacity = '1';
    }
  }

  sendToDetection() {
    this.messageEvent.emit(this.colZone);
  }

  private calculateColZones(anchor: Node, leaf: Node) {
    // calculate vertices of leaf node
    let first = {
      'x' : 0,
      'y' : 0,
      'alpha': 0
    };
    let second = {
      'x' : 0,
      'y' : 0,
      'alpha': 0
    };
    const leafA = {
      'x' : leaf.x - ( this.nodeSize / 2 ),
      'y' : leaf.y - ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const leafB = {
      'x' : leaf.x + ( this.nodeSize / 2 ),
      'y' : leaf.y - ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const leafC = {
      'x' : leaf.x + ( this.nodeSize / 2 ),
      'y' : leaf.y + ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const leafD = {
      'x' : leaf.x - ( this.nodeSize / 2 ),
      'y' : leaf.y + ( this.nodeSize / 2 ),
      'alpha': 0
    };
    const leafVer = {
      'a': leafA,
      'b': leafB,
      'c': leafC,
      'd': leafD
    };

    for (const ver of [leafVer.a, leafVer.b, leafVer.c, leafVer.d]) {
      const x = angularMath.squareOfNumber(angularMath.powerOfNumber(leaf.x - ver.x, 2) + angularMath.powerOfNumber(leaf.y - ver.y, 2));
      const y = angularMath.squareOfNumber(angularMath.powerOfNumber(anchor.x - ver.x, 2) + angularMath.powerOfNumber(anchor.y - ver.y, 2));
      const z = angularMath.squareOfNumber(angularMath.powerOfNumber(anchor.x - leaf.x, 2) + angularMath.powerOfNumber(anchor.y - leaf.y, 2));

      ver.alpha = angularMath.acosNumber((angularMath.powerOfNumber(x, 2) - angularMath.powerOfNumber(y, 2) - angularMath.powerOfNumber(z, 2)) / ((-2) * y * z));

      if (ver.alpha > first.alpha) {
        second = first;
        first = ver;
      } else if (ver.alpha > second.alpha) {
        second = ver;
      }
    }

    const fourth = {
      'x' : (first.x - anchor.x) * this.width * this.height,
      'y' : (first.y - anchor.y) * this.width * this.height
    };
    const third = {
      'x' : (second.x - anchor.x) * this.width * this.height,
      'y' : (second.y - anchor.y) * this.width * this.height
    };

    // divide coordinations until 5 digits (svg considers 5 digit numbers okay)
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
    this.linkNodeZones.push(polygon);
  }

  private chooseColZoneTuples(via: Node[], anch: Node[]) {
    this.tuplesList = [];
    interface nodeTuple {
      anchor: Node;
      leaf: Node;
    }
    let nodeTuple: nodeTuple = {
      anchor: undefined,
      leaf: undefined
    };
    for (const anchorNode of anch) {
      for (const viableNode of via) {
        nodeTuple = {
          anchor: anchorNode,
          leaf: viableNode
        };
        this.tuplesList.push(nodeTuple);
      }
    }
    for (const anchorNode of anch) {
      for (const secondAnchorNode of anch) {
        if (secondAnchorNode != anchorNode) {
          nodeTuple = {
            anchor: anchorNode,
            leaf: secondAnchorNode
          };
          this.tuplesList.push(nodeTuple);
        }
      }
    }

    for (const tuple of this.tuplesList) {
      this.calculateColZones(tuple.anchor, tuple.leaf);
    }

  }

  private chooseNodes() {
    this.filteredNodes = this.nodes;
    if (this.draggedNode !== undefined && this.draggedNode != null) {
      if (this.draggedNode.children !== undefined) {
        this.nodes.forEach(node => {
            this.draggedNode.children.forEach(host => {
              if (node == host && node instanceof HostNode) {
                this.filteredNodes = this.filteredNodes.filter(item => item !== node);
              }
            });
        });
      }
    }
    this.linkNodeZones = [];
    this.viableNodes = [];
    this.anchorNodes = [];
    // choose viable and anchor nodes
    if (this.draggedNode != null) {
      for (const node of this.filteredNodes) {
        if (node != this.draggedNode) {
          let connected = false;
          for (const link of this.links) {
            if ((link.source == this.draggedNode && link.target == node) || (link.source == node && link.target == this.draggedNode)) {
              connected = true;
            }
          }
          if (connected == false) {
            this.viableNodes.push(node);
          } else {
            this.anchorNodes.push(node);
          }
        }
      }
    }
    // calculate zones for every combination of anchor and viable node
    this.chooseColZoneTuples(this.viableNodes, this.anchorNodes);
    // this.linkNodeZones = []
  }

}
