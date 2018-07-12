import { StatusEnum } from '../enums/status-enum';
import {NodeHostDecorator} from './node-host-decorator';

/**
 * Node status decorator. Can be ON, OFF or unknown
 */
export class NodeStatusDecorator extends NodeHostDecorator {
  status: StatusEnum;

  constructor(nodeId: number, status: StatusEnum) {
    super(nodeId);
    this.status = status;
  }
}
