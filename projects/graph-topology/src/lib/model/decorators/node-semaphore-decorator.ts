import {NodeSemaphoreDecoratorStatusEnum} from '../enums/node-semaphore-decorator-status-enum';
import {NodeHostDecorator} from './node-host-decorator';

/**
 * Node semaphore decorator. Can be RED, ORANGE, GREEN
 */
export class NodeSemaphoreDecorator extends NodeHostDecorator {
  x: number;
  y: number;
  status: NodeSemaphoreDecoratorStatusEnum;

  constructor(nodeId: number, status: NodeSemaphoreDecoratorStatusEnum) {
    super(nodeId);
    this.status = status;
  }
}
