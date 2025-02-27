import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HostNode, Node, NodePhysicalRoleEnum, RouterNode, SwitchNode } from '@crczp/topology-graph-model';
import { NodeSemaphoreDecorator } from '../../model/decorators/node-semaphore-decorator';
import { NodeStatusDecorator } from '../../model/decorators/node-status-decorator';
import { StatusEnum } from '../../model/enums/status-enum';
import { NodeDecorator } from '../../model/decorators/node-decorator';
import { NodeLogicalRoleDecorator } from '../../model/decorators/node-logical-role-decorator';
import { RouterNodeDecoratorTypeEnum } from '../../model/enums/router-node-decorator-type-enum';
import { HostNodeDecoratorTypeEnum } from '../../model/enums/host-node-decorator-type-enum';
import { DecoratorCategoryEnum } from '../../model/enums/decorator-category-enum';
import { GraphEventService } from '../../services/graph-event.service';
import { ICONS_PATH } from '../../icons-path';
import { Dimensions } from '../../model/others/dimensions';

/**
 * Visual component used for displaying nodes of the graph-visual and its decorators. Binds to node model.
 */
@Component({
    selector: '[nodeVisual]',
    templateUrl: './graph-node-visual.component.html',
    styleUrls: ['./graph-node-visual.component.css'],
})
export class GraphNodeVisualComponent implements OnDestroy, OnInit {
    private readonly DEFAULT_NODE_WIDTH = 92;
    private readonly DEFAULT_NODE_HEIGHT = 70;

    @Input() node: Node;
    @Input() zoom: number;
    @Input() cloudSandboxInstance: boolean;
    @Input() graphSize: Dimensions;
    @Input() isConsoleReady: boolean;
    @Output() polling: EventEmitter<boolean> = new EventEmitter();
    @Output() loadConsoles: EventEmitter<string> = new EventEmitter();
    @Output() showContainers: EventEmitter<boolean> = new EventEmitter();

    iconsPath = ICONS_PATH;
    hasContextMenu: boolean;
    width: number;
    height: number;
    labels = [];
    subnetSize = 0;
    hasContainers = false;

    statusDecorator: NodeStatusDecorator;
    semaphoreDecorator: NodeSemaphoreDecorator;
    logicalRoleDecorator: NodeLogicalRoleDecorator;

    private _decoratorEventSubscription;

    constructor(private graphEventService: GraphEventService) {}

    /**
     * Sets width and height of node based on amount of node's attributes to be shown and calculates text labels and its position
     */
    ngOnInit(): void {
        // unknown status decorator is created because node class is resolved from it
        this.statusDecorator = new NodeStatusDecorator('', StatusEnum.Unknown);
        this.width = this.calculateNodeWidth();
        this.height = this.calculateNodeHeight();
        this.subnetSize = this.getChildrenCount();
        this.initLabels();
        this.initContainers();
        this.hasContextMenu = this.node instanceof HostNode || this.node instanceof RouterNode;
    }

    /**
     * Changing node sub network state(collapsed or revealed) if node is of type Router. Reloads decorator for all children nodes
     */
    onDoubleClick() {
        if (this.node instanceof SwitchNode && this.node.hasExpandableSubnetwork()) {
            this.changeSubnetworkState(this.node);
        }
    }

    onPollingStateChange(event: boolean): void {
        this.polling.emit(event);
    }

    onLoadConsoles(event: string): void {
        this.loadConsoles.emit(event);
    }

    /**
     * Changes subnetwork state (Revealed -> Hidden, Hidden -> Revealed) and sends requests to graph to delete hidden nodes and links
     * @param {SwitchNode} node which state should be changed
     */
    private changeSubnetworkState(node: SwitchNode) {
        if (node.hasExpandableSubnetwork()) {
            node.changeSwitchPhysicalRole();
            if (node.physicalRole === NodePhysicalRoleEnum.Cloud) {
                if (node.children != null && node.children.length > 0) {
                    node.children.forEach((d) => {
                        if (d instanceof SwitchNode && d.physicalRole === NodePhysicalRoleEnum.Switch) {
                            this.changeSubnetworkState(d);
                        }
                    });
                }
                this.graphEventService.hideSubnet(node);
            } else if (node.physicalRole === NodePhysicalRoleEnum.Switch) {
                this.graphEventService.revealSubnet(node);
            }
        }
    }

    /**
     * Refreshes all decorators if change was triggered by DecoratorEventService
     */
    private onDecoratorChange(
        category: DecoratorCategoryEnum,
        decoratorTypes: RouterNodeDecoratorTypeEnum[] | HostNodeDecoratorTypeEnum[],
        nodeDecorators: NodeDecorator[],
    ) {
        // extract decorators for this node
        const decorators = nodeDecorators.filter((d) => d.nodeName === this.node.name);

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
            if (decorator instanceof NodeSemaphoreDecorator) {
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
    private removeNonActiveHostDecorators(
        activeDecoratorTypes: HostNodeDecoratorTypeEnum[],
        activeDecorators: NodeDecorator[],
    ) {
        if (
            activeDecoratorTypes.includes(HostNodeDecoratorTypeEnum.NodeStatusDecorator) &&
            !activeDecorators.find((dec) => dec instanceof NodeStatusDecorator)
        ) {
            this.statusDecorator = new NodeStatusDecorator('', StatusEnum.Unknown);
        }

        if (
            activeDecoratorTypes.includes(HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator) &&
            !activeDecorators.find((dec) => dec instanceof NodeSemaphoreDecorator)
        ) {
            this.semaphoreDecorator = null;
        }

        if (
            activeDecoratorTypes.includes(HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator) &&
            !activeDecorators.find((dec) => dec instanceof NodeLogicalRoleDecorator)
        ) {
            this.logicalRoleDecorator = null;
        }
    }

    private removeNonActiveRouterDecorators(
        activeDecoratorTypes: RouterNodeDecoratorTypeEnum[],
        activeDecorators: NodeDecorator[],
    ) {
        if (
            activeDecoratorTypes.includes(RouterNodeDecoratorTypeEnum.LogicalRoleDecorator) &&
            !activeDecorators.find((dec) => dec instanceof NodeLogicalRoleDecorator)
        ) {
            this.logicalRoleDecorator = null;
        }
    }

    /**
     * Removes all filtered out decorators if change was triggered by DecoratorEventService
     * @param decoratorTypes array of decorator types to be removed
     * @param decoratorCategory decorator category which types should be removed
     */
    private onDecoratorRemoved(decoratorTypes, decoratorCategory) {
        if (decoratorTypes != null && decoratorTypes.length > 0) {
            const first = decoratorTypes[0];
            if (
                Object.values(RouterNodeDecoratorTypeEnum).includes(first) &&
                decoratorCategory === DecoratorCategoryEnum.RouterDecorators &&
                this.node instanceof RouterNode
            ) {
                this.removeRouterDecorators(decoratorTypes as RouterNodeDecoratorTypeEnum[]);
            } else if (
                Object.values(HostNodeDecoratorTypeEnum).includes(first) &&
                decoratorCategory === DecoratorCategoryEnum.HostDecorators &&
                this.node instanceof HostNode
            ) {
                this.removeHostDecorators(decoratorTypes as HostNodeDecoratorTypeEnum[]);
            }
        }
    }

    /**
     *  Removes all filtered out router decorators if change was triggered by DecoratorEventService
     * @param {RouterNodeDecoratorTypeEnum[]} decoratorTypes array of decorator types to be removed
     */
    private removeRouterDecorators(decoratorTypes: RouterNodeDecoratorTypeEnum[]) {
        decoratorTypes.forEach((decoratorType) => {
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
        decoratorTypes.forEach((decoratorType) => {
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
                    this.statusDecorator = new NodeStatusDecorator('', StatusEnum.Unknown);
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
        return this.node instanceof SwitchNode && this.node.physicalRole === NodePhysicalRoleEnum.Cloud;
    }

    /**
     * Method for calculating width of node based on length of strings to be shown
     * @returns {number} calculated width of node
     */
    private calculateNodeWidth(): number {
        return this.DEFAULT_NODE_WIDTH;
    }

    /**
     * Calculates node height based on amount of text to be shown
     * @returns {number} calculated height of node
     */
    private calculateNodeHeight(): number {
        return this.DEFAULT_NODE_HEIGHT;
    }

    private getChildrenCount(): number {
        if (this.node instanceof SwitchNode && this.node.hasExpandableSubnetwork()) {
            return this.node.children.filter((node) => node instanceof HostNode).length;
        }
    }

    /**
     * Calculates labels and position of text based on node attributes.
     */
    private initLabels() {
        // initial position - in lower middle part of node
        const xPosition = 0;
        let yPosition = this.height / -2 + 50;

        if (this.node.nodePorts[0].ip != null) {
            this.labels.push({
                x: xPosition,
                y: yPosition,
                text: this.node.nodePorts[0].ip,
            });
            yPosition += 12;
        }
        if (this.node.name != null) {
            this.labels.push({
                x: xPosition,
                y: yPosition,
                text: this.node.name,
            });
        }
    }

    private initContainers() {
        this.hasContainers = this.node instanceof HostNode && this.node.containers.length > 0 ? true : false;

        //if at least one node has visible containers, we want to emit the info for the legend
        if (this.hasContainers) {
            this.showContainers.emit(true);
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
        decorator.x = this.width / 2 - 35;
        decorator.y = this.height / -2 + 5;
    }

    ngOnDestroy(): void {
        if (this._decoratorEventSubscription) {
            this._decoratorEventSubscription.unsubscribe();
        }
    }
}
