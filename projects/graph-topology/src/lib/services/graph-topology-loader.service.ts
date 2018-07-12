import { Injectable } from '@angular/core';
import { Link } from '../model/link/link';
import { HttpClient } from '@angular/common/http';
import {Node} from '../model/node/node';
import {HostNode} from '../model/node/host-node';
import {RouterNode} from '../model/node/router-node';
import {LinkTypeEnum} from '../model/enums/link-type-enum';
import {Observable} from 'rxjs';
import {NodeInterface} from '../model/node-interface/node-interface';
import {NodePhysicalRoleEnum} from '../model/enums/node-physical-role-enum';
import {map} from 'rxjs/operators';

/**
 * Service for getting JSON data about topology of network and parsing them to model suitable for visualization
 * Creates hierarchical model inside nodes elements but returns it as flat array because hierarchical graph-visual are not supported
 * by D3 and it would cause problems. This way we can remain hierarchical structure inside model and
 * implement functions needed for visualization  in our own way.
 */

@Injectable()
export class GraphTopologyLoaderService {

  constructor(private http: HttpClient) {
  }

  /**
   * Sends HTTP request and parses data for topology model
   * @param {string} url where should be send GET request
   * @returns {Observable<{nodes: Node[], links: Link[]}>} Observable of topology model
   * Caller needs to subscribe for it.
   */
  getTopology(url: string): Observable<{nodes: Node[], links: Link[]}> {
    return this.http.get(url)
      .pipe(map(
        response => {
          return this.parseResponse(response);
        }
      ));
   }

  /**
   * Parses provides JSON response and creates topology model usable in application
   * @param httpResponse JSON response describing the topology
   * @returns {{nodes: Node[], links: Link[]}} Created nodes and links which should be usable in applications graphs
   */
  private parseResponse(httpResponse): {nodes: Node[], links: Link[]} {
    const interfaces: NodeInterface[] = this.parseInterfaces(httpResponse.topology);
    const nodes: Node[] = this.parseNodes(httpResponse.topology);
    this.matchNodesWithInterfaces(nodes, interfaces);

    const links: Link[] = this.parseLinks(httpResponse.topology, nodes, interfaces);
    this.createHierarchicalStructure(nodes, links);
    return {nodes, links};
  }

  private createHierarchicalStructure(nodes: Node[], links: Link[]) {
    const topLayerNodes = nodes.filter((node) => node instanceof RouterNode);
    topLayerNodes.forEach((node) => {
      const router = node as RouterNode;
      router.children = this.findChildrenOfNode(router, nodes, links);
    });
  }

  private findChildrenOfNode(node: Node, nodes: Node[], links: Link[]): Node[] {
    const children: Node[] = [];
    const nodeLinks = links.filter(link => link.type === LinkTypeEnum.InterfaceOverlay
      && (link.sourceInterface.nodeId === node.id || link.targetInterface.nodeId === node.id));

    nodeLinks.forEach((link) => {
      if (link.sourceInterface.nodeId === node.id) {
        children.push(nodes.find(d => d.id === link.targetInterface.nodeId));
      }
    });
    return children;
  }

  private parseInterfaces(jsonTopology): NodeInterface[] {
    const interfaces: NodeInterface[] = [];
    for (const nodeInterface of jsonTopology.interfaces) {
      interfaces.push(new NodeInterface(
        nodeInterface.id,
        nodeInterface.node_id,
        nodeInterface.ipv4_address,
        nodeInterface.ipv6_address
      ));
    }
    return interfaces;
  }

  private parseNodes(jsonTopology): Node[] {
    const nodes: Node[] = [];
    for (const node of jsonTopology.nodes) {

      if (node.router) {
        nodes.push(new RouterNode(
          node.id,
          NodePhysicalRoleEnum[this.getPhysicalRoleString(node.physical_role)],
          node.name));
      } else {
        nodes.push(new HostNode(
          node.id,
          NodePhysicalRoleEnum[this.getPhysicalRoleString(node.physical_role)],
          node.name));
      }
    }
    return nodes;
  }

  private parseLinks(jsonTopology, nodes: Node[], interfaces: NodeInterface[]): Link[] {
    const links: Link[] = [];
    for (const link of jsonTopology.links) {
      const linkType = link.between_routers ? LinkTypeEnum.InternetworkingOverlay : LinkTypeEnum.InterfaceOverlay;

      const sourceInterface = this.findInterfaceById(link.source_interface_id, interfaces);
      const targetInterface = this.findInterfaceById(link.target_interface_id, interfaces);

      links.push(new Link(
        link.id,
        sourceInterface,
        targetInterface,
        this.findNodeById(sourceInterface.nodeId, nodes),
        this.findNodeById(targetInterface.nodeId, nodes),
        linkType));
    }
    return links;
  }

  private matchNodesWithInterfaces(nodes: Node[], interfaces: NodeInterface[]) {
    nodes.forEach((node) => {
      node.nodeInterfaces = this.findInterfaceForNode(node.id, interfaces);
    });
  }

  private findInterfaceForNode(nodeId: number, interfaces: NodeInterface[]): NodeInterface[] {
    return interfaces.filter(nodeInterface => nodeInterface.nodeId === nodeId);
  }

  private findNodeById(nodeId, nodes: Node[]) {
    return nodes.find(node => node.id === nodeId);
  }

  private findInterfaceById(interfaceId: number, interfaces: NodeInterface[]) {
    return interfaces.find(nodeInterface => nodeInterface.id === interfaceId);
  }


  /**
   * Helper method to transfer physical string to match PascalCase Enum
   * @param {string} role
   * @returns {string}
   */
  private getPhysicalRoleString(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

}
