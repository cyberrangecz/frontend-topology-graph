import {NodePhysicalRoleEnum} from '../enums/node-physical-role-enum';
import {Geo} from '../others/geo';
import {GeoNode} from './geo-node';
import {NodeInterface} from '../node-interface/node-interface';

export class GeoRouterNode extends GeoNode {

  children: GeoNode[];

  constructor(id: number,
              physicalRole: NodePhysicalRoleEnum,
              name: string,
              geo: Geo) {
    super(id, physicalRole, name, geo);
  }
}
