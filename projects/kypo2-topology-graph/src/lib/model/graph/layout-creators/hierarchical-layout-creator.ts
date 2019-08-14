
import {Node, SwitchNode} from 'kypo2-topology-graph-model';

import {Point} from '../../others/point';
import {Dictionary} from 'typescript-collections';

/**
 * Creates hierarchical layout. Creates dictionary of node ids and its calculated x,y positions
 */
export class HierarchicalLayoutCreator {
  private readonly DISTANCE_BETWEEN_TREE_LEVELS = 150;

  private nodes: Node[];
  private nodePositions: Dictionary<string, Point>;

  private width: number;
  private height: number;

  private layers: Dictionary<string, number>;


  constructor(width: number, height) {
    this.nodes = [];
    this.nodePositions = new Dictionary<string, Point>();
    this.layers = new Dictionary<string, number>();
    this.width = width;
    this.height = height;
  }

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  /**
   * Calculates position from nodes
   * @param {Node[]} nodes to which positions should be calculated
   * @returns {Dictionary<string, Point>} calculated dictionary of node names and positions
   */
  getPositionsForNodes(nodes: Node[]): Dictionary<string, Point>  {
    this.nodes = nodes;
    this.initializePositions();
    this.calculateNodeLayers();
    this.calculatePositions();
    return this.nodePositions;
  }

  /**
   * Initializes dictionary with default ids and positions
   */
  private initializePositions() {
    this.nodes.forEach(node => this.nodePositions.setValue(node.name, new Point(-1, -1)));
  }

  /**
   * Calculate x and y positions for all nodes
   */
  private calculatePositions() {
    this.calculateXPositions();
    this.calculateYPositions();
  }

  /**
   * Calculates x positions for all nodes
   */
  private calculateXPositions() {
    const nodesWithoutParents = this.findNodesWithoutParents();
    this.calculateXPositionForTopLayer(nodesWithoutParents);
    this.calculateXPositionForSubnets(nodesWithoutParents);

  }

  /**
   * Calculate X positions for all nodes in every layer except the first one
   * @param {Node[]} topLayerNodes top layer nodes (nodes without parents)
   */
  private calculateXPositionForSubnets(topLayerNodes: Node[]) {
    topLayerNodes.forEach(node => {
      if (node instanceof SwitchNode
        && node.children !== null
        && node.children.length > 0
        && this.nodes.includes(node.children[0])) {

        const nodeXPosition = this.nodePositions.getValue(node.name).x;
        this.calculateXPositionsForSubnetsRecursively(node.children, nodeXPosition);
      }
    });
  }

  /**
   * Calculates X positions for all children nodes and recursively calls this method for its children
   * @param {Node[]} nodes array of nodes whose X positions should be calculated
   * @param {number} parentXPosition calculated position of parent
   */
  private calculateXPositionsForSubnetsRecursively(nodes: Node[], parentXPosition: number) {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    const middleNodeId = this.getMiddleNodeName(nodes);
    const distanceCoefficient = this.calculateSubnetDistanceCoefficient();
    this.setXPositionForMiddleNodeInSubnet(middleNodeId, distanceCoefficient, nodes.length, parentXPosition);

    this.calculateXPositionsForNodes(nodes, middleNodeId, distanceCoefficient);

    nodes.forEach(node => {
      if (node instanceof SwitchNode
        && node.children !== null
        && node.children.length > 0
        && this.nodes.includes(node.children[0])) {

        const nodeXPosition = this.nodePositions.getValue(node.name).x;
        this.calculateXPositionsForSubnetsRecursively(node.children, nodeXPosition);
      }
    });
  }

  /**
   * Calculates X positions for top layer (nodes without parents)
   * @param {Node[]} nodes top layer nodes
   */
  private calculateXPositionForTopLayer(nodes: Node[]) {
    nodes.sort((a, b) => a.name.localeCompare(b.name));

    const middleNodeName = this.getMiddleNodeName(nodes);
    const distanceCoefficient = this.calculateTopLayerDistanceCoefficient(nodes.length);
    this.setXPositionForMiddleNodeInTopLayer(middleNodeName, distanceCoefficient, nodes.length);

    this.calculateXPositionsForNodes(nodes, middleNodeName, distanceCoefficient);
  }

  /**
   * Calculates X position of nodes from certain layer based on provided parameters
   * @param {Node[]} nodes array of nodes whose positions should be calculated
   * @param {number} middleNodeName name of middle node in provided array
   * @param {number} distanceCoefficient distance by which should be every next node shifted
   */
  private calculateXPositionsForNodes(nodes: Node[], middleNodeName: string, distanceCoefficient: number) {
    let leftNodesCount = 0;
    let rightNodesCount = 0;

    nodes.forEach((node) => {
      const middleXPosition = this.nodePositions.getValue(middleNodeName).x;

      if (node.name.localeCompare(middleNodeName)) {
        this.setXPosition(node.name, (middleXPosition + (distanceCoefficient * (++rightNodesCount))));
      } else {
        this.setXPosition(node.name, (middleXPosition - (distanceCoefficient * (++leftNodesCount))));
      }
    });
  }

  /**
   * Calculates and sets position for middle node in top layer (nodes without parents)
   * @param {string} nodeName name of middle node
   * @param {number} distanceCoefficient distance by which should be middle position shifted if it is needed
   * @param {number} nodeCountInTopLayer number of nodes in top layer
   */
  private setXPositionForMiddleNodeInTopLayer(nodeName: string, distanceCoefficient: number, nodeCountInTopLayer: number) {
    if (nodeCountInTopLayer % 2 === 0) {
      this.setXPosition(nodeName, ((this.width / 2) + (distanceCoefficient / 2)));
    } else {
      this.setXPosition(nodeName, (this.width / 2));
    }
  }

  /**
   * Calculates and sets position for middle node in lower layer subnets
   * @param {string} nodeName nodeId id of middle node
   * @param distanceCoefficient  distance by which should be middle position shifted if it is needed
   * @param {number} nodeCount number of nodes in current layer (only for the current subnet, not total count)
   * @param {number} parentXPosition calculated X position of parent of this subnet
   */
  private setXPositionForMiddleNodeInSubnet(nodeName: string, distanceCoefficient, nodeCount: number, parentXPosition: number) {
    if (nodeCount % 2 === 0) {
      this.setXPosition(nodeName, (parentXPosition + (distanceCoefficient / 2)));
    } else {
      this.setXPosition(nodeName, parentXPosition );
    }
  }

  /**
   * Returns name of middle node in provided array
   * @param {Node[]} nodes array of nodes where should be the middle node found
   * @returns {number} id of found middle node
   */
  private getMiddleNodeName(nodes: Node[]): string {
    return nodes[Math.floor((nodes.length / 2))].name;
  }

  /**
   * Calculates distance coefficient for top layer (nodes without parents)
   * @param {number} nodeCountInTopLayer number of nodes in top layer
   * @returns {number} calculated coefficient
   */
  private calculateTopLayerDistanceCoefficient(nodeCountInTopLayer: number): number {
    return(this.width / nodeCountInTopLayer);
  }

  /**
   * Calculates distance coefficient for lower subnets
   * @returns {number} calculated coefficient
   */
  private calculateSubnetDistanceCoefficient(): number {
    return 100;
  }


  /**
   * Calculates y position for each node in a graph for hierarchical layout.
   * First calculates how many levels are in the 'tree' then assigns y positions based on that information
   * @returns {Dictionary<string, number>} dictionary of node names as a keys and its y position as a value
   */
 private calculateYPositions() {
   this.nodes.forEach(d => {
     this.setYPosition(d.name, this.layers.getValue(d.name) * this.DISTANCE_BETWEEN_TREE_LEVELS);
   });
 }

  /**
   * Sets Y position to id in dict
   * @param {string} nodeName name of node
   * @param {number} value y value of node
   */
 private setYPosition(nodeName: string, value: number) {
   this.nodePositions.getValue(nodeName).y = value;
 }

  /**
   * Sets X position to id in dict
   * @param {string} nodeName name of node
   * @param {number} value x value of node
   */
 private setXPosition(nodeName: string, value: number) {
   this.nodePositions.getValue(nodeName).x = value;
 }

  /**
   * Finds if node has set correct (not default) x position in dict
   * @param {nodeName} nodeName name of node
   * @returns {boolean} true if correct x position is found, false otherwise
   */
 private hasXPosition(nodeName: string): boolean {
   return this.nodePositions.getValue(nodeName).x >= 0;
 }

  /**
   * Finds if node has set correct (not default) y position in dict
   * @param {string} nodeName of node
   * @returns {boolean} true if correct y position is found, false otherwise
   */
 private hasYPosition(nodeName: string) {
   return this.nodePositions.getValue(nodeName).y >= 0;

 }

  /**
   * Calculates layer (depth) of each node in a graph
   */
  private calculateNodeLayers() {
    this.nodes.forEach(node => {
      if (!this.layers.getValue(node.name)) {
        this.calculateNodeLayersRecursively(node, 1);
      }
    });
  }

  /**
   * Recursively calculates node's layer in a graph
   * @param {Node} node which layer should be calculated
   * @param {number} currLevel current layer (passed from parent or initial call - set to 1)
   */
  private calculateNodeLayersRecursively(node: Node, currLevel: number) {
    this.layers.setValue(node.name, currLevel);
    if (node instanceof SwitchNode) {
      node.children.forEach(child => this.calculateNodeLayersRecursively(child, (currLevel + 1)));
    }
  }

  /**
   * Finds parent of a node
   * @param {Node} node which parent should be found
   * @returns {SwitchNode} parent of a node, null if node has no parent
   */
  private findParent(node: Node): SwitchNode {
    for (const d of this.nodes) {
      if (d instanceof SwitchNode && d.children.includes(node)) {
        return d;
      }
    }
    return null;
  }

  /**
   * Finds all nodes without parent (top-layer in hierarchy)
   * @returns {Node[]} array of nodes without parent
   */
  private findNodesWithoutParents(): Node[] {
    return this.nodes.filter(d => !this.findParent(d));
  }
}
