import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Node } from '../../model/node/node';
import { RouterNode } from '../../model/node/router-node';
import { Subject } from 'rxjs';
import {NodeSemaphoreDecorator} from '../../model/decorators/node-semaphore-decorator';
import {NodeStatusDecorator} from '../../model/decorators/node-status-decorator';
import {DecoratorEventService} from '../../services/decorator-event.service';
import {StatusEnum} from '../../model/enums/status-enum';
import {NodeDecorator} from '../../model/decorators/node-decorator';
import {NodePhysicalRoleEnum} from '../../model/enums/node-physical-role-enum';
import {NodeLogicalRoleDecorator} from '../../model/decorators/node-logical-role-decorator';
import {RouterNodeDecoratorTypeEnum} from '../../model/enums/router-node-decorator-type-enum';
import {HostNodeDecoratorTypeEnum} from '../../model/enums/host-node-decorator-type-enum';
import {DecoratorEventMessageEnum} from '../../model/enums/decorator-event-message-enum';
import {HostNode} from '../../model/node/host-node';
import {DecoratorCategoryEnum} from '../../model/enums/decorator-category-enum';
import {GraphEventService} from '../../services/graph-event.service';
import {ContextMenuItemsEnum} from '../../model/enums/node-context-menu-items-enum';
import {DecoratorReloadTimerService} from '../../services/decorator-reload-timer.service';

/**
 * Visual component used for displaying nodes of the graph-visual and its decorators. Binds to node model.
 */
@Component({
  selector: '[nodeVisual]',
  templateUrl: './graph-node-visual.component.html',
  styleUrls: ['./graph-node-visual.component.css'],

})
export class GraphNodeVisualComponent implements OnDestroy, OnInit {

  readonly DEFAULT_NODE_WIDTH = 75;
  readonly DEFAULT_NODE_HEIGHT = 70;

  @Input('nodeVisual') node: Node;

  showContextMenu: boolean;
  contextMenuItems = [];
  width: number;
  height: number;
  labels = [];

  statusDecorator: NodeStatusDecorator;
  semaphoreDecorator: NodeSemaphoreDecorator;
  logicalRoleDecorator: NodeLogicalRoleDecorator;

  private _decoratorEventSubscription;

  constructor(private decoratorEventService: DecoratorEventService,
              private graphEventService: GraphEventService,
              private decoratorReloadTimerService: DecoratorReloadTimerService) {
    // unknown status decorator is created because node class is resolved from it
    this.statusDecorator = new NodeStatusDecorator(0, StatusEnum.Unknown);

    this.contextMenuItems = this.initContextMenuItems();
    this.subscribeToDecoratorEvents();

  }


  /**
   * Sets width and height of node based on amount of node's attributes to be shown and calculates text labels and its position
   */
  ngOnInit(): void {
    this.width = this.calculateNodeWidth();
    this.height = this.calculateNodeHeight();
    this.initLabels();
  }

  /**
   * Changing node sub network state(collapsed or revealed) if node is of type Router. Reloads decorator for all children nodes
   */
  onDoubleClick() {
    if (this.node instanceof RouterNode) {
      this.changeSubnetworkState(this.node);
      this.loadDecoratorsForSubnet(this.node);
    }
  }

  /**
   * Changes subnetwork state (Revealed -> Hidden, Hidden -> Revealed) and sends requests to graph to delete hidden nodes and links
   * @param {RouterNode} node which state should be changed
   */
  private changeSubnetworkState(node: RouterNode) {
    node.changeRouterPhysicalRole();

    if (node.physicalRole === NodePhysicalRoleEnum.Cloud) {
      // recursively collapse all child nodes
      if (node.children != null && node.children.length > 0) {
        node.children.forEach(d => {
          if (d instanceof RouterNode && d.physicalRole === NodePhysicalRoleEnum.Router) {
            this.changeSubnetworkState(d);
          }
        });
      }
      this.graphEventService.hideSubnet(node);

    } else if (node.physicalRole === NodePhysicalRoleEnum.Router) {
      this.graphEventService.revealSubnet(node);
    }
  }

  /**
   * Subscribes to DecoratorEvents
   */
  private subscribeToDecoratorEvents() {
    this._decoratorEventSubscription = this.decoratorEventService.onNodeDecoratorsChange
      .subscribe({
          next: (event) => {
            if (event.message === DecoratorEventMessageEnum.DecoratorsLoaded) {
              this.onDecoratorChange(event.category, event.decoratorTypes, event.payload);
            } else if (event.message === DecoratorEventMessageEnum.DecoratorsDeleted) {
              this.onDecoratorRemoved(event.decoratorTypes, event.category);
            }
          }
        }
      );
  }

  /**
   * Initializes context menu
   */
  private initContextMenuItems() {
    return [
      {
        id: 1,
        type: ContextMenuItemsEnum.RemoteConnection,
        title: ContextMenuItemsEnum.RemoteConnection,
        subject: new Subject()
      }
/*      {
        id: 2,
        type: ContextMenuItemsEnum.Start,
        title: ContextMenuItemsEnum.Start,
        subject: new Subject()
      },
      {
        id: 3,
        type: ContextMenuItemsEnum.Restart,
        title: ContextMenuItemsEnum.Restart,
        subject: new Subject()
      },
      {
        id: 4,
        type: ContextMenuItemsEnum.CreateRunningSnapshot,
        title: ContextMenuItemsEnum.CreateRunningSnapshot,
        subject: new Subject()
      },
      {
        id: 5,
        type: ContextMenuItemsEnum.RevertRunningSnapshot,
        title: ContextMenuItemsEnum.RevertRunningSnapshot,
        subject: new Subject()
      },*/
    ];
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
   * Refreshes all decorators if change was triggered by DecoratorEventService
   */
  private onDecoratorChange(category: DecoratorCategoryEnum,
                            decoratorTypes: RouterNodeDecoratorTypeEnum[] | HostNodeDecoratorTypeEnum[],
                            nodeDecorators: NodeDecorator[]) {

    // extract decorators for this node
    const decorators = nodeDecorators.filter(d => d.nodeId === this.node.id);

    if (category === DecoratorCategoryEnum.RouterDecorators && this.node instanceof RouterNode) {
      this.addActiveRouterDecorators(decorators);
      this.removeNonActiveRouterDecorators(decoratorTypes as RouterNodeDecoratorTypeEnum[], decorators);

    } else if (category === DecoratorCategoryEnum.HostDecorators && this.node instanceof HostNode) {
      this.addActiveHostDecorators(decorators);
      this.removeNonActiveHostDecorators(decoratorTypes as HostNodeDecoratorTypeEnum[], decorators);
    }

  }

  /**
   * Adds all decorators received in latest event
   * @param {NodeDecorator[]} activeDecorators decorators present in latest received event
   */
  private addActiveHostDecorators(activeDecorators: NodeDecorator[]) {
    for (const decorator of activeDecorators) {
      if (decorator instanceof NodeStatusDecorator) {
        this.statusDecorator = decorator;
      }
      if (decorator instanceof  NodeSemaphoreDecorator) {
        this.semaphoreDecorator = decorator;
        this.calculateSemaphoreDecoratorPosition(this.semaphoreDecorator);
      }
      if (decorator instanceof NodeLogicalRoleDecorator) {
        this.logicalRoleDecorator = decorator;
        this.calculateLogicalRolePosition(this.logicalRoleDecorator);
      }
    }
  }

  private addActiveRouterDecorators(activeDecorators: NodeDecorator[]) {
    for (const decorator of activeDecorators) {
      if (decorator instanceof NodeLogicalRoleDecorator) {
        this.logicalRoleDecorator = decorator;
        this.calculateLogicalRolePosition(this.logicalRoleDecorator);
      }
    }
  }

  /**
   * Removes all old decorators (decorators not present in latest received event).
   * Compares received decorator objects with decorator types which should be affected by the reload
   * to avoid removing decorator objects which which was not reloaded.
   * @param {HostNodeDecoratorTypeEnum[]} activeDecoratorTypes decorator types present in
   * latest received event (which decorator types should not be removed)
   * @param {NodeDecorator[]} activeDecorators decorator objects present in latest received event (which decorators should not be removed)
   */
  private removeNonActiveHostDecorators(activeDecoratorTypes: HostNodeDecoratorTypeEnum[], activeDecorators: NodeDecorator[]) {
    if (activeDecoratorTypes.includes(HostNodeDecoratorTypeEnum.NodeStatusDecorator)
      && !activeDecorators.find(dec => dec instanceof NodeStatusDecorator)) {
      this.statusDecorator = new NodeStatusDecorator(0, StatusEnum.Unknown);
    }

    if (activeDecoratorTypes.includes(HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator)
      && !activeDecorators.find(dec => dec instanceof NodeSemaphoreDecorator)) {
      this.semaphoreDecorator = null;
    }

    if (activeDecoratorTypes.includes(HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator)
      && !activeDecorators.find(dec => dec instanceof NodeLogicalRoleDecorator)) {
      this.logicalRoleDecorator = null;
    }
  }

  private removeNonActiveRouterDecorators(activeDecoratorTypes: RouterNodeDecoratorTypeEnum[], activeDecorators: NodeDecorator[]) {
    if (activeDecoratorTypes.includes(RouterNodeDecoratorTypeEnum.LogicalRoleDecorator)
      && !activeDecorators.find(dec => dec instanceof NodeLogicalRoleDecorator)) {
      this.logicalRoleDecorator = null;}
  }

  /**
   * Removes all filtered out decorators if change was triggered by DecoratorEventService
   * @param decoratorTypes array of decorator types to be removed
   * @param decoratorCategory decorator category which types should be removed
   */
  private onDecoratorRemoved(decoratorTypes, decoratorCategory) {
    if (decoratorTypes != null && decoratorTypes.length > 0) {
      const first = decoratorTypes[0];
      if (Object.values(RouterNodeDecoratorTypeEnum).includes(first)
          && decoratorCategory === DecoratorCategoryEnum.RouterDecorators
          && this.node instanceof RouterNode) {

        this.removeRouterDecorators(decoratorTypes as RouterNodeDecoratorTypeEnum[]);

      } else if (Object.values(HostNodeDecoratorTypeEnum).includes(first)
          && decoratorCategory === DecoratorCategoryEnum.HostDecorators
          && this.node instanceof HostNode) {

        this.removeHostDecorators(decoratorTypes as HostNodeDecoratorTypeEnum[]);
      }
    }
  }

  /**
   *  Removes all filtered out router decorators if change was triggered by DecoratorEventService
   * @param {RouterNodeDecoratorTypeEnum[]} decoratorTypes array of decorator types to be removed
   */
  private removeRouterDecorators(decoratorTypes: RouterNodeDecoratorTypeEnum[]) {
    decoratorTypes.forEach(decoratorType => {
      switch (decoratorType) {
        case RouterNodeDecoratorTypeEnum.LogicalRoleDecorator: {
          this.logicalRoleDecorator = null;
          break;
        }
        default:
          break;
      }
    });
  }

  /**
   *  Removes all filtered out host decorators if change was triggered by DecoratorEventService
   * @param {HostNodeDecoratorTypeEnum[]} decoratorTypes array of decorator types to be removed
   */
  private removeHostDecorators(decoratorTypes: HostNodeDecoratorTypeEnum[]) {
    decoratorTypes.forEach(decoratorType => {
      switch (decoratorType) {
        case HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator: {
          this.semaphoreDecorator = null;
          break;
        }
        case HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator: {
          this.logicalRoleDecorator = null;
          break;
        }
        case HostNodeDecoratorTypeEnum.NodeStatusDecorator: {
          this.statusDecorator = new NodeStatusDecorator(0, StatusEnum.Unknown);
          break;
        }
        default:
          break;
      }
    });
  }

  /**
   * Decides whether subnet is hidden or expanded
   * @returns {boolean} true if hidden, false otherwise
   */
  isSubnetHidden(): boolean {
    return this.node instanceof RouterNode && this.node.physicalRole === NodePhysicalRoleEnum.Cloud;
  }

  /**
   * Method for calculating width of node based on length of strings to be shown
   * @returns {number} calculated width of node
   */
  private calculateNodeWidth(): number  {
    let currentWidth = this.DEFAULT_NODE_WIDTH;
    let longestStringLen = 12; // default value that matches 75px width

    if (this.node.nodeInterfaces[0].address4 != null
      && this.node.nodeInterfaces[0].address6 != null) {
      this.height = 75;
    }

    // adding +5 width for every char in ipv4 address longer than current longest string to be drawn
    if (this.node.nodeInterfaces[0].address4 != null
      && this.node.nodeInterfaces[0].address4.length > 12) {
      currentWidth += (this.node.nodeInterfaces[0].address4.length - 12) * 5;
      longestStringLen = this.node.nodeInterfaces[0].address4.length;
    }

    // adding +5 width for every char in name longer than current longest string to be drawn
    if (this.node.name != null
      && this.node.name.length > longestStringLen) {
      currentWidth += (this.node.name.length - 12 ) * 5;
      longestStringLen = this.node.name.length;
    }

    // adding +5 width for every char in ipv6 address longer than current longest string to be drawn
    if (this.node.nodeInterfaces[0].address6 != null
      && this.node.nodeInterfaces[0].address6.length > longestStringLen) {
      currentWidth += (this.node.nodeInterfaces[0].address6.length - 12) * 5;
      longestStringLen = this.node.nodeInterfaces[0].address6.length;
    }

    return currentWidth;
  }

  /**
   * Calculates node height based on amount of text to be shown
   * @returns {number} calculated height of node
   */
  private calculateNodeHeight(): number {
    const height = this.DEFAULT_NODE_HEIGHT;
    if (this.node.nodeInterfaces[0].address4 != null
      && this.node.nodeInterfaces[0].address6 != null
      && this.node.name != null) {
      return height + 10;
    } else {
      return height;
    }
  }

  /**
   * Calculates labels and position of text based on node attributes.
   */
  private initLabels() {
    // initial position - in lower left corner of node
    let xPosition = this.width / (-2) + 5;
    let yPosition = this.height / (-2) + 50;

    if (this.node.nodeInterfaces[0].address4 != null) {
      this.labels.push(
        {
          x: xPosition,
          y: yPosition,
          text: this.node.nodeInterfaces[0].address4
        });
      yPosition += 12;
    }

    if (this.node.nodeInterfaces[0].address6 != null) {
      this.labels.push(
        {
          x: xPosition,
          y: yPosition,
          text: this.node.nodeInterfaces[0].address6
        });
      yPosition += 12;
    }

    if (this.node.name != null) {
      this.labels.push(
        {
          x: xPosition,
          y: yPosition,
          text: this.node.name
        });
    }
  }

  /**
   * Calculates position of semaphore decorator
   * @param {NodeSemaphoreDecorator} decorator node decorator
   */
  private calculateSemaphoreDecoratorPosition(decorator: NodeSemaphoreDecorator) {
    decorator.x = this.width / 2;
    decorator.y = this.height / 2;
  }

  private calculateLogicalRolePosition(decorator: NodeLogicalRoleDecorator) {
    decorator.x = this.width / (2) - 35;
    decorator.y = this.height / (-2) + 5;
  }

  ngOnDestroy(): void {
    if (this._decoratorEventSubscription) {
      this._decoratorEventSubscription.unsubscribe();
    }
  }
}
