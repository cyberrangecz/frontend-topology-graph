import {NodePhysicalRoleEnum} from '../enums/node-physical-role-enum';
import {NodeInterface} from '../node-interface/node-interface';
import {SimulationNodeDatum} from 'd3';

export interface INode extends SimulationNodeDatum {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: number;
  physicalRole: NodePhysicalRoleEnum;
  name: string;
  nodeInterfaces: NodeInterface[];
}
