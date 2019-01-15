import {Injectable} from '@angular/core';
import {Link, Node} from 'graph-topology-model-lib';
import {TopologyDTO} from '../model/DTO/topology-dto.model';

@Injectable()
export class TopologySerializer {

  serializeTopology(topology: TopologyDTO): {nodes: Node[], links: Link[]} {
    const nodes = this.serializeNodes(topology);
    const links = this.serializeLinks(topology, nodes);

    return {
      nodes: nodes,
      links: links
    }
  }

  private serializeNodes(topology: TopologyDTO): Node[] {
    return null;
  }

  private serializeLinks(topology: TopologyDTO, nodes: Node[]): Link[] {
    return null;
  }

}
