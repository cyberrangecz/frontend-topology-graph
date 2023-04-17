import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ForceDirectedGraph } from '../../model/graph/force-directed-graph';
import { D3Service } from '../../services/d3.service';
import { Link, SwitchNode } from '@muni-kypo-crp/topology-model';
import { Node } from '@muni-kypo-crp/topology-model';
import { GraphEventService } from '../../services/graph-event.service';
import { GraphEventTypeEnum } from '../../model/enums/graph-event-type-enum';
import { Subscription } from 'rxjs';
import { GraphEvent } from '../../model/events/graph-event';
import { RouterNode } from '@muni-kypo-crp/topology-model';
import { NodePhysicalRoleEnum } from '@muni-kypo-crp/topology-model';
import { DecoratorEventService } from '../../services/decorator-event.service';
import { DecoratorCategoryEnum } from '../../model/enums/decorator-category-enum';
import { GraphLockService } from '../../services/graph-lock.service';

/**
 * Visual component used to display graph-visual. Size of window is set and nodes and links are bound to the model
 */
@Component({
  selector: 'graph',
  templateUrl: './graph-visual.component.html',
  styleUrls: ['./graph-visual.component.css'],
})
export class GraphVisualComponent implements OnInit, OnChanges, OnDestroy {
  @Input('nodes') nodes: Node[];
  @Input('links') links: Link[];
  @Input('width') width: number;
  @Input('height') height: number;
  @Input('draggedNode') draggedNode: Node;
  @Input() cloudSandboxInstance: boolean;
  @Input() isConsoleReady: boolean;
  @Output() polling: EventEmitter<boolean> = new EventEmitter();
  @Output() loadConsoles: EventEmitter<string> = new EventEmitter();
  @Output() showContainers: EventEmitter<boolean> = new EventEmitter();

  graph: ForceDirectedGraph;

  /**
   * true if in locked canvas mode (fixed size) , false otherwise
   */
  lockedCanvas: boolean;

  defaultWidth: number;
  defaultHeight: number;

  private _graphEventSubscription: Subscription;
  private _graphLockSubscription: Subscription;
  private _d3ResizeSubscription: Subscription;

  constructor(
    private d3Service: D3Service,
    private graphEventService: GraphEventService,
    private graphLockService: GraphLockService,
    private decoratorEventService: DecoratorEventService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('width' in changes || 'height' in changes) {
      this.defaultWidth = this.width;
      this.defaultHeight = this.height;
      if (this.graph) {
        this.graph.onResize(this.options);
      }
    }
  }

  /**
   * Size of window of displayed SVG
   * @returns {{width: number; height: number}} option parameters - windows size
   */
  get options() {
    if (this.lockedCanvas) {
      return {
        width: this.defaultWidth,
        height: this.defaultHeight,
      };
    } else {
      return {
        width: this.width,
        height: this.height,
      };
    }
  }

  /**
   * Creates graph visualization and subscribes for its ticks
   */
  ngOnInit() {
    this.defaultWidth = this.width;
    this.defaultHeight = this.height;

    this.graph = this.d3Service.createForceDirectedGraph(this.nodes, this.links, this.options);
    this.lockedCanvas = this.graphLockService.getLocked();

    this.subscribeGraphEvents();
    this.subscribeGraphLock();
    this.subscribeD3GraphResize();
    this.subscribeGraphTicker();

    // collapse all subnets on start only if they are larger than 12
    if (this.graph.nodes.length > 12) {
      this.graphEventService.collapseAll();
    }
    this.graph.initPosition();
  }

  onPollingStateChange(event: boolean): void {
    this.polling.emit(event);
  }

  onLoadConsoles(event: string): void {
    this.loadConsoles.emit(event);
  }

  onShowContainers(event: boolean): void {
    this.showContainers.emit(event);
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
    this.graph.nodes.forEach((node) => {
      if (node instanceof SwitchNode && node.physicalRole === NodePhysicalRoleEnum.Cloud) {
        this.expandSubnetworkOfNode(node);
      }
    });
  }

  /**
   * Recursively expands subnetworks of node
   * @param {SwitchNode} node which subnetworks should be expanded
   */
  private expandSubnetworkOfNode(node: SwitchNode) {
    if (node.hasExpandableSubnetwork()) {
      node.changeSwitchPhysicalRole();
      this.graph.addSubnetwork(node);
      this.loadDecoratorsForSubnet(node);
      node.children.forEach((d) => {
        if (d instanceof SwitchNode && d.physicalRole === NodePhysicalRoleEnum.Cloud) {
          this.expandSubnetworkOfNode(d);
        }
      });
    }
  }

  /**
   * Extract ids of subnet and sends request for reloading decorators for all new nodes and links.
   * @param {SwitchNode} node
   */
  private loadDecoratorsForSubnet(node: SwitchNode) {
    if (node.physicalRole === NodePhysicalRoleEnum.Router) {
      const hostNames: string[] = [];
      const routerNames: string[] = [];
      node.children.forEach((child) => {
        if (child instanceof SwitchNode) {
          routerNames.push(child.name);
        } else {
          hostNames.push(child.name);
        }
      });

      // We call reload of decorators on all affected hosts and routers
      // and all links (we cannot select connected links from this component)
      // 100 ms timeout is to give application enough time to load new components completely before loading decorators.
      if (hostNames.length > 0) {
        setTimeout(
          () =>
            this.decoratorEventService.triggerDecoratorReloadRequest(
              DecoratorCategoryEnum.HostDecorators,
              null,
              hostNames
            ),
          100
        );
      }

      if (routerNames.length > 0) {
        setTimeout(
          () =>
            this.decoratorEventService.triggerDecoratorReloadRequest(
              DecoratorCategoryEnum.RouterDecorators,
              null,
              routerNames
            ),
          100
        );
      }

      if (routerNames.length > 0 || hostNames.length > 0) {
        setTimeout(
          () => this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.LinkDecorators, null),
          100
        );
      }
    }
  }

  /**
   * Collapses every subnetwork in a graph
   */
  private collapseAllSubnetworks() {
    this.graph.getSwitchNodes(this.graph.nodes).forEach((node) => {
      if (node instanceof SwitchNode && node.physicalRole === NodePhysicalRoleEnum.Switch) {
        this.collapseSubnetworkOfNode(node);
      }
    });
  }

  /**
   * Recursively collapses subnetworks of node.
   * @param {RouterNode} node which subnetworks should be collapsed
   */
  private collapseSubnetworkOfNode(node: SwitchNode) {
    if (node.hasExpandableSubnetwork()) {
      node.changeSwitchPhysicalRole();
      node.children.forEach((d) => {
        if (d instanceof SwitchNode && d.physicalRole === NodePhysicalRoleEnum.Switch) {
          this.collapseSubnetworkOfNode(d);
        }
      });
      this.graph.removeSubnetwork(node);
    }
  }

  /**
   * Subscribes to graph events
   */
  private subscribeGraphEvents() {
    this._graphEventSubscription = this.graphEventService.graphEvent.subscribe({
      next: (event) => {
        this.resolveGraphEvent(event);
      },
    });
  }

  /**
   * Subscribes to graph ticker
   */
  private subscribeGraphTicker() {
    this.graph.ticker.subscribe(() => {
      this.ref.markForCheck();
    });
  }

  /**
   * Subscribes for graph lock/unlock event
   */
  private subscribeGraphLock() {
    this._graphLockSubscription = this.graphLockService.lockedEvent.subscribe((value) => {
      this.lockedCanvas = value;
      if (this.lockedCanvas) {
        this.graph.lock();
        this.width = this.defaultWidth;
        this.height = this.defaultHeight;

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
    this._d3ResizeSubscription = this.d3Service.resizeEvent.subscribe((value) => {
      if (this.width < value.x) {
        this.width = value.x + 500;
      }
      if (this.height < value.y) {
        this.height = value.y + 500;
      }
    });
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
