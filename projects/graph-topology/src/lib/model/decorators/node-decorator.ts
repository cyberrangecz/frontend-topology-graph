/**
 * Abstract node decorator
 */
export abstract class NodeDecorator {
  nodeName: string;

  constructor(nodeName: string) {
    this.nodeName = nodeName;
  }
}
