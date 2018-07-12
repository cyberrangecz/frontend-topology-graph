import {Geo} from '../others/geo';
import {INode} from './inode';
export interface IGeoNode extends INode {
  geo: Geo;
}
