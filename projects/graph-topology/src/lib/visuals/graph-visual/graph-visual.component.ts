import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ForceDirectedGraph } from '../../model/graph/force-directed-graph';
import { D3Service } from '../../services/d3.service';
import { Link } from '../../model/link/link';
import { Node } from '../../model/node/node';
import {GraphEventService} from '../../services/graph-event.service';
import {GraphEventTypeEnum} from '../../model/enums/graph-event-type-enum';
import {Subscription} from 'rxjs';
import {GraphEvent} from '../../model/events/graph-event';
import {RouterNode} from '../../model/node/router-node';
import {NodePhysicalRoleEnum} from '../../model/enums/node-physical-role-enum';
import {DecoratorEventService} from '../../services/decorator-event.service';
import {DecoratorCategoryEnum} from '../../model/enums/decorator-category-enum';
import {GraphLockService} from '../../services/graph-lock.service';

/**
 * Visual component used to display graph-visual. Size of window is set and nodes and links are bound to the model
 */
@Component({
  selector: 'graph',
  templateUrl: './graph-visual.component.html',
  styleUrls: ['./graph-visual.component.css'],
})
export class GraphVisualComponent implements OnInit, OnDestroy {
  @Input('nodes') nodes: Node[];
  @Input('links') links: Link[];

  graph: ForceDirectedGraph;

  lockedCanvas: boolean;

  private width: number =  window.innerWidth - 25;
  private height: number =  window.innerHeight - 70;

  private _graphEventSubscription: Subscription;
  private _graphLockSubscription: Subscription;
  private _d3ResizeSubscription: Subscription;

  constructor(private d3Service: D3Service,
              private graphEventService: GraphEventService,
              private graphLockService: GraphLockService,
              private decoratorEventService: DecoratorEventService,
              private ref: ChangeDetectorRef) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.onResize(this.options);
  }

  /**
   * Size of window of displayed SVG
   * @returns {{width: number; height: number}} option parameters - windows size
   */
  get options() {
    if (this.lockedCanvas) {
      return {
        width: window.innerWidth - 25,
        height: window.innerHeight - 70
      };
    } else {
      return {
        width: this.width,
        height: this.height
      };
    }
  }


  /**
   * Creates graph visualization and subscribes for its ticks
   */
  ngOnInit() {
    this.graph = this.d3Service.createForceDirectedGraph(this.nodes, this.links, this.options);
    this.lockedCanvas = this.graphLockService.getLocked();

    this.subscribeGraphEvents();
    this.subscribeGraphLock();
    this.subscribeD3GraphResize();
    this.subscribeGraphTicker();

    // collapse all subnets on start
    this.graphEventService.collapseAll();
    this.graph.initPosition();
  }


  /**
   * Resolves received graph event and calls appropriate methods of graph-visual model
   * @param {GraphEventTypeEnum} event received event from service
   */
  private resolveGraphEvent(event: GraphEvent) {
    switch (event.message) {
      case GraphEventTypeEnum.ExpandAllSubnets: {
        this.expandAllSubnetworks();
        break;
      }
      case GraphEventTypeEnum.CollapseAllSubnets: {
        this.collapseAllSubnetworks();
        break;
      }
      case GraphEventTypeEnum.HideSubnet: {
        this.graph.removeSubnetwork(event.payload);
        break;
      }
      case GraphEventTypeEnum.RevealSubnet: {
        this.graph.addSubnetwork(event.payload);
        break;
      }
      case GraphEventTypeEnum.BalloonTreeLayout: {
        this.graph.balloonTreeLayout();
        break;
      }
      case GraphEventTypeEnum.HierarchicalLayout: {
        this.graph.hierarchicalLayout();
        break;
      }
      case GraphEventTypeEnum.FitToScreen: {
        this.graph.fitToScreen();
        break;
      }
      case GraphEventTypeEnum.TurnOffForces: {
        this.graph.turnOffForces();
        break;
      }
    }
  }

  /**
   * Expand every subnetwork in graph
   */
  private expandAllSubnetworks() {
    this.graph.nodes.forEach(node => {
      if (node instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Cloud) {
        this.expandSubnetworkOfNode(node);
      }
    });
  }

  /**
   * Recursively expands subnetworks of node
   * @param {RouterNode} node which subnetworks should be expanded
   */
  private expandSubnetworkOfNode(node: RouterNode) {
    node.changeRouterPhysicalRole();
    this.graph.addSubnetwork(node);
    this.loadDecoratorsForSubnet(node);
    // recursively expand all children nodes
    if (node.children != null && node.children.length > 0) {
      node.children.forEach(d => {
        if (d instanceof RouterNode && d.physicalRole === NodePhysicalRoleEnum.Cloud) {
          this.expandSubnetworkOfNode(d);
        }
      });
    }
  }

  /**
   * Extract ids of subnet and sends request for reloading decorators for all new nodes and links.
   * @param {RouterNode} node
   */
  private loadDecoratorsForSubnet(node: RouterNode) {
    if (node.physicalRole === NodePhysicalRoleEnum.Router) {
      const hostIds: number[] = [];
      const routerIds: number[] = [];
      node.children.forEach(
        child => {
          if (child instanceof RouterNode) {
            routerIds.push(child.id);
          } else {
            hostIds.push(child.id);
          }
        });

      // We call reload of decorators on all affected hosts and routers
      // and all links (we cannot select connected links from this component)
      // 100 ms timeout is to give application enough time to load new components completely before loading decorators.
      if (hostIds.length > 0) {
        setTimeout(() =>
            this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.HostDecorators, null, hostIds),
          100);
      }

      if (routerIds.length > 0) {
        setTimeout(() =>
            this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.RouterDecorators, null, routerIds),
          100
        );
      }

      if (routerIds.length > 0 || hostIds.length > 0) {
        setTimeout(() =>
            this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.LinkDecorators, null),
          100);
      }
    }
  }

  /**
   * Collapses every subnetwork in a graph
   */
  private collapseAllSubnetworks() {
    this.graph.getRouterNodes(this.graph.nodes).forEach(node => {
      if (node instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
        this.collapseSubnetworkOfNode(node);
      }
    });
  }

  /**
   * Recursively collapses subnetworks of node.
   * @param {RouterNode} node which subnetworks should be collapsed
   */
  private collapseSubnetworkOfNode(node: RouterNode) {
    node.changeRouterPhysicalRole();
    // recursively collapse all children nodes
    if (node.children != null && node.children.length > 0) {
      node.children.forEach(d => {
        if (d instanceof RouterNode && d.physicalRole === NodePhysicalRoleEnum.Router) {
          this.collapseSubnetworkOfNode(d);
        }
      });
    }
    this.graph.removeSubnetwork(node);
  }

  /**
   * Subscribes to graph events
   */
  private subscribeGraphEvents() {
    this._graphEventSubscription = this.graphEventService.graphEvent.subscribe({
      next: event => {
        this.resolveGraphEvent(event);
      }
    });
  }

  /**
   * Subscribes to graph ticker
   */
  private subscribeGraphTicker() {
    this.graph.ticker.subscribe(
      () => {
        this.ref.markForCheck();
      }
    );
  }

  /**
   * Subscribes for graph lock/unlock event
   */
  private subscribeGraphLock() {
    this._graphLockSubscription = this.graphLockService.lockedEvent.subscribe((value) => {
      this.lockedCanvas = value;
      if (this.lockedCanvas) {
        this.width = window.innerWidth - 25;
        this.height = window.innerHeight - 70;
        this.graph.lock();
        this.graph.onResize(this.options);
      } else {
        this.graph.unlock();
        this.graph.onResize(this.options);
      }
    });
  }

  /**
   * Subscribes for resize event when a node is dragged outside the window
   */
  private subscribeD3GraphResize() {
    this._d3ResizeSubscription = this.d3Service.resizeEvent.subscribe(((value) => {
      console.log(value);
      if (this.width < value.x) {
        this.width = value.x + 500;
      }
      if (this.height < value.y) {
        this.height = value.y + 500;
      }
    }));
  }

  /**
   * Unsubscribe observables on end of component
   */
  ngOnDestroy(): void {
    if (this._graphEventSubscription) {
      this._graphEventSubscription.unsubscribe();
    }
    if (this._graphLockSubscription) {
      this._graphLockSubscription.unsubscribe();
    }
    if (this._d3ResizeSubscription) {
      this._d3ResizeSubscription.unsubscribe();
    }
  }
}
