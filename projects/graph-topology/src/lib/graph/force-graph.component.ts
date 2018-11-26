import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Link} from 'graph-topology-model-lib';
import {Node} from 'graph-topology-model-lib';
import {GraphTopologyLoaderService} from '../services/graph-topology-loader.service';
import {DecoratorLoaderService} from '../services/decorator-loader.service';
import {HostNode} from 'graph-topology-model-lib';
import {RouterNode} from 'graph-topology-model-lib';

import {DecoratorEventService} from '../services/decorator-event.service';
import {DecoratorReloadRequestEvent} from '../model/events/decorator-reload-request-event';
import {DecoratorCategoryEnum} from '../model/enums/decorator-category-enum';
import {RouterNodeDecoratorTypeEnum} from '../model/enums/router-node-decorator-type-enum';
import {HostNodeDecoratorTypeEnum} from '../model/enums/host-node-decorator-type-enum';
import {LinkDecoratorTypeEnum} from '../model/enums/link-decorator-type-enum';
import {DecoratorReloadTimerService} from '../services/decorator-reload-timer.service';

import {D3Service} from '../services/d3.service';
import {D3ZoomEventService} from '../services/d3-zoom-event.service';
import {MatSnackBar} from '@angular/material';
import {interval} from 'rxjs/internal/observable/interval';
import {ConfigService} from '../services/config.service';
import {DraggedNodeService} from '../services/dragged-node.service';
/**
 * Main component of the graph-visual topology application.
 * On start it loads topology and decorators and store results in nodes and links attributes which are later
 * used to construct and draw graph-visual of topology. Data can be also reloaded periodically or manually by user.
 * Loaded data attribute is used for marking if getting data from server and parsing was already finished and
 * its safe to construct graph-visual.
 */
@Component({
  selector: 'lib-force-graph',
  templateUrl: './force-graph.component.html',
  styleUrls: ['./force-graph.component.css']
})
export class ForceGraphComponent implements OnInit, OnDestroy {

  @Input('width') width: number;
  @Input('height') height: number;

  nodes: Node[];
  links: Link[];

  loadedTopology = false;
  showZoomResetButton = false;
  sidebarOpen = false;


  private _decoratorPeriodicalReloadSubscription;
  private _decoratorTimerSubscription;
  private _decoratorReloadSubscription;
  private _decoratorLoadErrorSubscription;
  private _zoomResetSubscription;

  constructor(
    public snackBar: MatSnackBar,
    private configService: ConfigService,
    private topologyLoaderService: GraphTopologyLoaderService,
    private decoratorLoaderService: DecoratorLoaderService,
    private decoratorEventService: DecoratorEventService,
    private decoratorReloadTimerService: DecoratorReloadTimerService,
    private d3ZoomEventService: D3ZoomEventService,
    private d3Service: D3Service,
    private draggedNode: DraggedNodeService) {
  }


  /**
   * Loads first topology and decorators and subscribes for periodical refresh of decorators and decorator reload requests.
   */
  ngOnInit(): void {
    this.loadTopology();
    if (this.configService.config.useDecorators && this.decoratorReloadTimerService.getReloadPeriod() > 0) {
      setTimeout(() => this.loadAllDecorators(), 100);
    }

    if (this.configService.config.useDecorators) {
      this.subscribeDecoratorsPeriodicalReload();
      this.subscribeDecoratorTimer();
      this.subscribeDecoratorReloadEvent();
      this.subscribeDecoratorError();
    }

    this.subscribeZoomChangeEvent();
  }


  /**
   * Reloads topology and its decorators.
   */
  reloadTopology() {
    this.loadTopology();
    if (this.configService.config.useDecorators && this.decoratorReloadTimerService.getReloadPeriod() > 0) {
      setTimeout(() => this.loadAllDecorators(), 100);
    }
  }

  /**
   * Calls topology loader service and updates attributes based on result
   */
  loadTopology() {
    this.loadedTopology = false;
    this.topologyLoaderService.getTopology(this.configService.config.topologyRestUrl)
      .subscribe(
        data => {
          this.nodes = data.nodes;
          this.links = data.links;
           this.loadedTopology = true;
        }
      );
  }

  /**
   * Calls service to load decorators with node and link ids
   */
  loadAllDecorators() {
    this.decoratorLoaderService.loadAllDecorators(this.getHostNodeIds(), this.getRouterNodeIds(), this.getLinkIds());
  }

  /**
   * For manual reload of decorators
   */
  reloadAllDecorators() {
    this.loadAllDecorators();
  }


  resetZoom() {
    this.showZoomResetButton = false;
    this.d3Service.resetZoom();
  }

  zoomIn() {
    this.d3Service.zoomIn();
  }

  zoomOut() {
    this.d3Service.zoomOut();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /**
   * Processes request to reload decorators from other component or service
   * @param {DecoratorReloadRequestEvent} reloadEvent event containing category type and decorator type which should be reloaded
   */
  private processDecoratorReloadRequest(reloadEvent: DecoratorReloadRequestEvent) {
    switch (reloadEvent.decoratorCategory) {
      case DecoratorCategoryEnum.RouterDecorators: {
        this.processDecoratorRouterReload(reloadEvent.ids, reloadEvent.decoratorType as RouterNodeDecoratorTypeEnum);
        break;
      }
      case DecoratorCategoryEnum.HostDecorators: {
        this.processDecoratorHostReload(reloadEvent.ids, reloadEvent.decoratorType as HostNodeDecoratorTypeEnum);
        break;
      }
      case DecoratorCategoryEnum.LinkDecorators: {
        this.processDecoratorLinkReload(reloadEvent.ids, reloadEvent.decoratorType as LinkDecoratorTypeEnum);
        break;
      }
    }
  }

  /**
   * Processes request to reload router decorator of certain type
   * @param {number[]} ids array of ids of elements whose decorators should be reloaded. If null all ids are used
   * @param {RouterNodeDecoratorTypeEnum} decoratorType decorator type which should be reloaded.
   * If null all active decorator types are reloaded
   */
  private processDecoratorRouterReload(ids: number[], decoratorType: RouterNodeDecoratorTypeEnum) {
    if ((ids === null || ids.length <= 0) && (decoratorType == null)) {
      this.decoratorLoaderService.loadRouterNodeDecorators(this.getRouterNodeIds());
    } else if (ids === null || ids.length <= 0) {
      this.decoratorLoaderService.loadRouterDecoratorsOfType(this.getRouterNodeIds(), decoratorType);
    } else if (decoratorType === null) {
      this.decoratorLoaderService.loadRouterNodeDecorators(ids);
    } else {
      this.decoratorLoaderService.loadRouterDecoratorsOfType(ids, decoratorType);
    }
  }

  /**
   * Processes request to reload host decorator of certain type
   * @param {number[]} ids array of ids of elements whose decorators should be reloaded. If null all ids are used
   * @param {HostNodeDecoratorTypeEnum} decoratorType decorator type which should be reloaded.
   * If null all active decorator types are reloaded
   */
  private processDecoratorHostReload(ids: number[], decoratorType: HostNodeDecoratorTypeEnum) {
    if ((ids === null || ids.length <= 0) && (decoratorType == null)) {
      this.decoratorLoaderService.loadHostNodeDecorators(this.getHostNodeIds());
    } else if (ids === null || ids.length <= 0) {
      this.decoratorLoaderService.loadHostDecoratorsOfType(this.getHostNodeIds(), decoratorType);
    } else if (decoratorType === null) {
      this.decoratorLoaderService.loadHostNodeDecorators(ids);
    } else {
      this.decoratorLoaderService.loadHostDecoratorsOfType(ids, decoratorType);
    }
  }

  /**
   * Process request to reload link decorator of certain type
   * @param {number[]} ids array of ids of elements whose decorators should be reloaded. If null all ids are used
   * @param {LinkDecoratorTypeEnum} decoratorType decorator type which should be reloaded.
   * If null all active decorator types are reloaded
   */
  private processDecoratorLinkReload(ids: number[], decoratorType: LinkDecoratorTypeEnum) {
    if ((ids === null || ids.length <= 0) && (decoratorType == null)) {
      this.decoratorLoaderService.loadLinkDecorators(this.getLinkIds());
    } else if (ids === null || ids.length <= 0) {
      this.decoratorLoaderService.loadLinkDecoratorsOfType(this.getLinkIds(), decoratorType);
    } else if (decoratorType === null) {
      this.decoratorLoaderService.loadLinkDecorators(ids);
    } else {
      this.decoratorLoaderService.loadLinkDecoratorsOfType(ids, decoratorType);
    }
  }

  /**
   * Method to find and return all ids of host nodes in graph-visual.
   * @returns {number[]} array of host nodes ids
   */
  private getHostNodeIds(): number[] {
    if (this.nodes === null || this.nodes === undefined || this.nodes.length === 0) {
      return [];
    }
    return this.nodes
      .filter(node => node instanceof HostNode)
      .map(({id}) => id);
  }

  /**
   * Method to find and return all ids of router nodes in graph-visual
   * @returns {number[]} array of router nodes ids
   */
  private getRouterNodeIds(): number[] {
    if (this.nodes === null || this.nodes === undefined || this.nodes.length === 0) {
      return [];
    }
    return this.nodes
      .filter(node => node instanceof RouterNode)
      .map(({id}) => id);

  }

  /**
   * Method to find and return all ids of links in graph-visual
   * @returns {number[]} array of link ids
   */
  private getLinkIds(): number[] {
    if (this.nodes === null || this.nodes === undefined || this.nodes.length === 0) {
      return [];
    }
    return this.links.map(({id}) => id);

  }

  /**
   * Subscribes to periodical reload of decorators
   */
  private subscribeDecoratorsPeriodicalReload() {
    if (this.configService.config.defaultDecoratorRefreshPeriodInSeconds > 0) {
      this._decoratorPeriodicalReloadSubscription = interval(this.configService.config.defaultDecoratorRefreshPeriodInSeconds * 1000)
        .subscribe(
          () => {
            this.reloadAllDecorators();
          }
        );
    }
  }

  /**
   * Subscribes to decorator period timer
   */
  private subscribeDecoratorTimer() {
    this._decoratorTimerSubscription = this.decoratorReloadTimerService.onReloadPeriodChange
      .subscribe(reloadPeriod => {
        if (reloadPeriod > 0) {
          if (this._decoratorPeriodicalReloadSubscription) {
            this._decoratorPeriodicalReloadSubscription.unsubscribe();
          }

          this._decoratorPeriodicalReloadSubscription = interval(reloadPeriod * 1000)
            .subscribe(
              () => {
                this.reloadAllDecorators();
              }
            );
        } else {
          if (this._decoratorPeriodicalReloadSubscription) {
            this._decoratorPeriodicalReloadSubscription.unsubscribe();
          }
        }
      });
  }
  /**
   * Subscribes to error in decorator loader
   */
  private subscribeDecoratorError() {
    this._decoratorLoadErrorSubscription = this.decoratorLoaderService.decoratorLoaderError.subscribe(
      (value) => {
        const snackRef = this.snackBar.open('Decorators failed to load: ' + value, 'Try again');
        snackRef._dismissAfter(5000);
        snackRef.onAction().subscribe(() => this.reloadAllDecorators());
        }
    );
  }

  /**
   * Subscribes to decorator reload events
   */
  private subscribeDecoratorReloadEvent() {
    this._decoratorReloadSubscription = this.decoratorEventService.onDecoratorReloadRequest
      .subscribe(
        (reloadEvent) => {
          this.processDecoratorReloadRequest(reloadEvent);
        });
  }

  /**
   * Subscribes to zoom change events
   */
  private subscribeZoomChangeEvent() {
    this._zoomResetSubscription = this.d3ZoomEventService.onZoomChange.subscribe(
      (value) => {
        if (value !== 1) {
          this.showZoomResetButton = true;
        }
      }
    );
  }

  /**
   * Unsubscribe from observables at the end of this component
   */
  ngOnDestroy() {
    if (this._decoratorPeriodicalReloadSubscription) {
      this._decoratorPeriodicalReloadSubscription.unsubscribe();
    }
    if (this._decoratorReloadSubscription) {
      this._decoratorReloadSubscription.unsubscribe();
    }
    if (this._decoratorTimerSubscription) {
      this._decoratorTimerSubscription.unsubscribe();
    }
    if (this._zoomResetSubscription) {
      this._zoomResetSubscription.unsubscribe();
    }
    if (this._decoratorLoadErrorSubscription) {
      this._decoratorLoadErrorSubscription.unsubscribe();
    }
  }
}
