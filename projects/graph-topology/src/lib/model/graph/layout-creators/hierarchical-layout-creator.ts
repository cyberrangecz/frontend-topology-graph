import Dictionary from 'typescript-collections/dist/lib/Dictionary';
import {Node} from '../../node/node';
import {Point} from '../../others/point';
import {RouterNode} from '../../node/router-node';

/**
 * Creates hierarchical layout. Creates dictionary of node ids and its calculated x,y positions
 */
export class HierarchicalLayoutCreator {
  private readonly DISTANCE_BETWEEN_TREE_LEVELS = 150;

  private nodes: Node[];
  private nodePositions: Dictionary<number, Point>;

  private width: number;
  private height: number;

  private layers: Dictionary<number, number>;


  constructor(width: number, height) {
    this.nodes = [];
    this.nodePositions = new Dictionary<number, Point>();
    this.layers = new Dictionary<number, number>();
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
   * @returns {Dictionary<number, Point>} calculated dictionary of node ids and positions
   */
  getPositionsForNodes(nodes: Node[]): Dictionary<number, Point>  {
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
    this.nodes.forEach(node => this.nodePositions.setValue(node.id, new Point(-1, -1)));
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
      if (node instanceof RouterNode
        && node.children !== null
        && node.children.length > 0
        && this.nodes.includes(node.children[0])) {

        const nodeXPosition = this.nodePositions.getValue(node.id).x;
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
    nodes.sort((a, b) => a.id - b.id);
    const middleNodeId = this.getMiddleNodeId(nodes);
    const distanceCoefficient = this.calculateSubnetDistanceCoefficient();
    this.setXPositionForMiddleNodeInSubnet(middleNodeId, distanceCoefficient, nodes.length, parentXPosition);

    this.calculateXPositionsForNodes(nodes, middleNodeId, distanceCoefficient);

    nodes.forEach(node => {
      if (node instanceof RouterNode
        && node.children !== null
        && node.children.length > 0
        && this.nodes.includes(node.children[0])) {

        const nodeXPosition = this.nodePositions.getValue(node.id).x;
        this.calculateXPositionsForSubnetsRecursively(node.children, nodeXPosition);
      }
    });
  }

  /**
   * Calculates X positions for top layer (nodes without parents)
   * @param {Node[]} nodes top layer nodes
   */
  private calculateXPositionForTopLayer(nodes: Node[]) {
    nodes.sort((a, b) => a.id - b.id);

    const middleNodeId = this.getMiddleNodeId(nodes);
    const distanceCoefficient = this.calculateTopLayerDistanceCoefficient(nodes.length);
    this.setXPositionForMiddleNodeInTopLayer(middleNodeId, distanceCoefficient, nodes.length);

    this.calculateXPositionsForNodes(nodes, middleNodeId, distanceCoefficient);
  }

  /**
   * Calculates X position of nodes from certain layer based on provided parameters
   * @param {Node[]} nodes array of nodes whose positions should be calculated
   * @param {number} middleNodeId id of middle node in provided array
   * @param {number} distanceCoefficient distance by which should be every next node shifted
   */
  private calculateXPositionsForNodes(nodes: Node[], middleNodeId: number, distanceCoefficient: number) {
    let leftNodesCount = 0;
    let rightNodesCount = 0;

    nodes.forEach((node) => {
      const middleXPosition = this.nodePositions.getValue(middleNodeId).x;

      if (node.id > middleNodeId) {
        this.setXPosition(node.id, (middleXPosition + (distanceCoefficient * (++rightNodesCount))));
      } else if (node.id < middleNodeId) {
        this.setXPosition(node.id, (middleXPosition - (distanceCoefficient * (++leftNodesCount))));
      }
    });
  }

  /**
   * Calculates and sets position for middle node in top layer (nodes without parents)
   * @param {number} nodeId id of middle node
   * @param {number} distanceCoefficient distance by which should be middle position shifted if it is needed
   * @param {number} nodeCountInTopLayer number of nodes in top layer
   */
  private setXPositionForMiddleNodeInTopLayer(nodeId: number, distanceCoefficient: number, nodeCountInTopLayer: number) {
    if (nodeCountInTopLayer % 2 === 0) {
      this.setXPosition(nodeId, ((this.width / 2) + (distanceCoefficient / 2)));
    } else {
      this.setXPosition(nodeId, (this.width / 2));
    }
  }

  /**
   * Calculates and sets position for middle node in lower layer subnets
   * @param {number} nodeId nodeId id of middle node
   * @param distanceCoefficient  distance by which should be middle position shifted if it is needed
   * @param {number} nodeCount number of nodes in current layer (only for the current subnet, not total count)
   * @param {number} parentXPosition calculated X position of parent of this subnet
   */
  private setXPositionForMiddleNodeInSubnet(nodeId: number, distanceCoefficient, nodeCount: number, parentXPosition: number) {
    if (nodeCount % 2 === 0) {
      this.setXPosition(nodeId, (parentXPosition + (distanceCoefficient / 2)));
    } else {
      this.setXPosition(nodeId, parentXPosition );
    }
  }

  /**
   * Returns id of middle node in provided array
   * @param {Node[]} nodes array of nodes where should be the middle node  found
   * @returns {number} id of found middle node
   */
  private getMiddleNodeId(nodes: Node[]): number {
    return nodes[Math.floor((nodes.length / 2))].id;
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
   * @returns {Dictionary<number, number>} dictionary of node ids as a keys and its y position as a value
   */
 private calculateYPositions() {
   this.nodes.forEach(d => {
     this.setYPosition(d.id, this.layers.getValue(d.id) * this.DISTANCE_BETWEEN_TREE_LEVELS);
   });
 }

  /**
   * Sets Y position to id in dict
   * @param {number} nodeId id of node
   * @param {number} value y value of node
   */
 private setYPosition(nodeId: number, value: number) {
   this.nodePositions.getValue(nodeId).y = value;
 }

  /**
   * Sets X position to id in dict
   * @param {number} nodeId id of node
   * @param {number} value x value of node
   */
 private setXPosition(nodeId: number, value: number) {
   this.nodePositions.getValue(nodeId).x = value;
 }

  /**
   * Finds if node has set correct (not default) x position in dict
   * @param {number} nodeId d of node
   * @returns {boolean} true if correct x position is found, false otherwise
   */
 private hasXPosition(nodeId: number): boolean {
   return this.nodePositions.getValue(nodeId).x >= 0;
 }

  /**
   * Finds if node has set correct (not default) y position in dict
   * @param {number} nodeId of node
   * @returns {boolean} true if correct y position is found, false otherwise
   */
 private hasYPosition(nodeId: number) {
   return this.nodePositions.getValue(nodeId).y >= 0;

 }

  /**
   * Calculates layer (depth) of each node in a graph
   */
  private calculateNodeLayers() {
    this.nodes.forEach(node => {
      if (!this.layers.getValue(node.id)) {
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
    this.layers.setValue(node.id, currLevel);
    if (node instanceof RouterNode) {
      node.children.forEach(child => this.calculateNodeLayersRecursively(child, (currLevel + 1)));
    }
  }

  /**
   * Finds parent of a node
   * @param {Node} node which parent should be found
   * @returns {RouterNode} parent of a node, null if node has no parent
   */
  private findParent(node: Node): RouterNode {
    for (const d of this.nodes) {
      if (d instanceof RouterNode && d.children.includes(node)) {
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
