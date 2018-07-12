import {NodeDecorator} from './node-decorator';

/**
 * Abstract class of host node decorator to distinguish router and host decorators
 */
export abstract class NodeHostDecorator extends NodeDecorator {

  constructor(nodeId: number) {
    super(nodeId);
  }
}
