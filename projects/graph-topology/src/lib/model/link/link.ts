import { Node } from '../node/node';
import { LinkTypeEnum } from '../enums/link-type-enum';
import {NodeInterface} from '../node-interface/node-interface';
import {SimulationLinkDatum} from 'd3';

export class Link implements SimulationLinkDatum<Node> {

  id: number;
  source: Node;
  target: Node;
  sourceInterface: NodeInterface;
  targetInterface: NodeInterface;
  type: LinkTypeEnum;


  constructor(id: number, sourceInterface: NodeInterface, targetInterface: NodeInterface, source: Node, target: Node, type: LinkTypeEnum) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.sourceInterface = sourceInterface;
    this.targetInterface = targetInterface;
    this.type = type;
  }
}
