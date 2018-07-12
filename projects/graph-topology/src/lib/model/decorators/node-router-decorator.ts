import {NodeDecorator} from './node-decorator';

/**
 * Abstract class of router node decorators to distinguish router and host decorators
 */
export abstract class NodeRouterDecorator extends NodeDecorator {

  constructor(nodeId: number) {
    super(nodeId);
  }
}
