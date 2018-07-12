import {Geo} from '../others/geo';
import {NodePhysicalRoleEnum} from '../enums/node-physical-role-enum';
import {GeoNode} from './geo-node';
import {NodeInterface} from '../node-interface/node-interface';

export class GeoHostNode extends GeoNode {

  constructor(id: number, type: NodePhysicalRoleEnum, name: string, geo: Geo) {
    super(id, type, name, geo);
  }
}
