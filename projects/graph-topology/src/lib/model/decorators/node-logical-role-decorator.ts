import {NodeLogicalRoleEnum} from '../enums/node-logical-role-enum';
import {NodeHostDecorator} from './node-host-decorator';

/**
 * Decorator of logical role of node. Can be ATTACKER, VICTIM or BOT
 */
export class NodeLogicalRoleDecorator extends NodeHostDecorator {
  x: number;
  y: number;
  role: NodeLogicalRoleEnum;

  constructor(nodeId: number, role: NodeLogicalRoleEnum) {
    super(nodeId);
    this.role = role;
  }
}
