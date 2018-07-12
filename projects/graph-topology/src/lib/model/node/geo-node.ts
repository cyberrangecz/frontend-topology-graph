import {NodePhysicalRoleEnum} from '../enums/node-physical-role-enum';
import {Geo} from '../others/geo';
import {IGeoNode} from './igeo-node';
import {NodeInterface} from '../node-interface/node-interface';

export abstract class GeoNode implements IGeoNode {

  id: number;
  physicalRole: NodePhysicalRoleEnum;
  name: string;
  nodeInterfaces: NodeInterface[];
  geo: Geo;

  constructor(id: number, physicalRole: NodePhysicalRoleEnum, name: string, geo: Geo) {
    this.id = id;
    this.physicalRole = physicalRole;
    this.name = name;
    this.geo = geo;
  }
}
