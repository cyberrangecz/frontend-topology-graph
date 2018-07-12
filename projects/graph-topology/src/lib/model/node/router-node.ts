/**
 * Router node. Has different behaviours than host node. Has set of children (sub network).
 * Can have two types - cloud if sub network is hidden or router if sub network is revealed.
 */

import { Node } from './node';
import { NodePhysicalRoleEnum } from '../enums/node-physical-role-enum';
import {INode} from './inode';

export class RouterNode extends Node {

  children: INode[];

  constructor(id, physicalRole, name) {
    super(id, physicalRole, name);
  }

  /**
   * Changes router physical role (Router -> Cloud or Cloud -> Router)
   * Router is role for revealed subnet
   * Cloud is role for hidden subnet
   */
  public changeRouterPhysicalRole() {
    if (this.physicalRole === NodePhysicalRoleEnum.Router) {
      this.physicalRole = NodePhysicalRoleEnum.Cloud;

    } else if (this.physicalRole === NodePhysicalRoleEnum.Cloud) {
      this.physicalRole = NodePhysicalRoleEnum.Router;
    }
  }
}
