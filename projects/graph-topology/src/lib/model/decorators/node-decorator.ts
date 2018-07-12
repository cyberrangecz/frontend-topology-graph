/**
 * Abstract node decorator
 */
export abstract class NodeDecorator {
  nodeId: number;

  constructor(nodeId: number) {
    this.nodeId = nodeId;
  }
}
