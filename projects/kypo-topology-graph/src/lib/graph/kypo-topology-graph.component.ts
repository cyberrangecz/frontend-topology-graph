import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Link } from '@muni-kypo-crp/topology-model';
import { Node } from '@muni-kypo-crp/topology-model';
import { TopologyApi } from '../services/topology-api.service';
import { DecoratorFacade } from '../services/decorator-facade.service';
import { HostNode } from '@muni-kypo-crp/topology-model';
import { RouterNode } from '@muni-kypo-crp/topology-model';

import { DecoratorEventService } from '../services/decorator-event.service';
import { DecoratorReloadRequestEvent } from '../model/events/decorator-reload-request-event';
import { DecoratorCategoryEnum } from '../model/enums/decorator-category-enum';
import { RouterNodeDecoratorTypeEnum } from '../model/enums/router-node-decorator-type-enum';
import { HostNodeDecoratorTypeEnum } from '../model/enums/host-node-decorator-type-enum';
import { LinkDecoratorTypeEnum } from '../model/enums/link-decorator-type-enum';
import { DecoratorReloadTimerService } from '../services/decorator-reload-timer.service';

import { D3Service } from '../services/d3.service';
import { D3ZoomEventService } from '../services/d3-zoom-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../services/config.service';
import { DraggedNodeService } from '../services/dragged-node.service';
import { BehaviorSubject, EMPTY, interval, Observable, takeWhile } from 'rxjs';
import { SandboxService } from '../services/sandbox.service';
import { KypoTopologyLoadingService } from '../services/kypo-topology-loading.service';
import { KypoTopologyErrorService } from '../services/kypo-topology-error.service';
import { HostService } from '../services/host.service';
import { ContextMenuService } from '../services/context-menu.service';
import { DecoratorFilterService } from '../services/decorator-filter.service';
import { DecoratorTimeService } from '../services/decorator-time.service';
import { DecoratorStateService } from '../services/decorator-state.service';
import { GraphEventService } from '../services/graph-event.service';
import { GraphLockService } from '../services/graph-lock.service';
import { catchError, map, take } from 'rxjs/operators';
import { ConsoleUrl } from '../model/others/console-url';
import { ResourcePollingService } from '../services/resource-polling.service';
/**
 * Main component of the graph-visual topology application.
 * On start it loads topology and decorators and store results in nodes and links attributes which are later
 * used to construct and draw graph-visual of topology. Data can be also reloaded periodically or manually by user.
 * Loaded data attribute is used for marking if getting data from server and parsing was already finished and
 * its safe to construct graph-visual.
 */
@Component({
  selector: 'kypo-topology-graph',
  templateUrl: './kypo-topology-graph.component.html',
  styleUrls: ['./kypo-topology-graph.component.css'],
  providers: [
    DecoratorFacade,
    SandboxService,
    HostService,
    D3Service,
    D3ZoomEventService,
    ContextMenuService,
    DecoratorReloadTimerService,
    DecoratorEventService,
    DecoratorFilterService,
    DecoratorTimeService,
    DecoratorStateService,
    GraphEventService,
    GraphLockService,
    DraggedNodeService,
    ResourcePollingService,
  ],
})
export class KypoTopologyGraphComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() width: number;
  @Input() height: number;
  @Input() sandboxUuid: string;
  @Input() sandboxDefinitionId: number;
  @Output() topologyLoadEmitter: EventEmitter<boolean> = new EventEmitter();

  protected readonly Math = Math;
  protected readonly legendWidth = 65;
  protected readonly sandwichMenuWidth = 48;

  private pollingSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  polling$: Observable<boolean> = this.pollingSubject$.asObservable();

  nodes: Node[];
  links: Link[];
  draggedNode: Node;
  isLoading$: Observable<boolean>;
  consoles$: Observable<ConsoleUrl[]>;
  isConsoleReady$: Observable<boolean>;
  dataLoaded: boolean;

  showLegendContainers = false;
  showZoomResetButton = false;
  sidebarOpen = false;
  isError = false;

  private _decoratorPeriodicalReloadSubscription;
  private _decoratorTimerSubscription;
  private _decoratorReloadSubscription;
  private _decoratorLoadErrorSubscription;
  private _zoomResetSubscription;
  private _nodeTouchedSubscription;
  private _nodeDraggedSubscription;
  private _nodeDragEndedSubscription;

  constructor(
    public snackBar: MatSnackBar,
    private configService: ConfigService,
    private loadingService: KypoTopologyLoadingService,
    private errorService: KypoTopologyErrorService,
    private topologyLoaderService: TopologyApi,
    private decoratorLoaderService: DecoratorFacade,
    private decoratorEventService: DecoratorEventService,
    private decoratorReloadTimerService: DecoratorReloadTimerService,
    private d3ZoomEventService: D3ZoomEventService,
    private graphEventService: GraphEventService,
    private sandboxService: SandboxService,
    private topologyApiService: TopologyApi,
    private d3Service: D3Service,
    private draggedNodeService: DraggedNodeService,
    private resourcePollingService: ResourcePollingService
  ) {}

  /**
   * Loads first topology and decorators and subscribes for periodical refresh of decorators and decorator reload requests.
   */
  ngOnInit(): void {
    this.subscribeLoading();
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
    this.subscribeDragNodeEvents();
    this.subscribeZoomChangeEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('sandboxUuid' in changes) {
      this.sandboxService.setSandboxInstanceId(this.sandboxUuid);
    }
    if ('sandboxDefinitionId' in changes) {
      this.sandboxService.setSandboxDefinitionId(this.sandboxDefinitionId);
    }
  }

  ngAfterViewInit(): void {
    if (this.sandboxUuid) {
      this.topologyApiService.getVMConsolesUrl(this.sandboxUuid).pipe(take(1)).subscribe();
      this.consoles$ = this.topologyApiService.consoles$;
    }
  }

  onPollingStateChange(event: boolean): void {
    this.pollingSubject$.next(event);
  }

  onLoadConsoles(event: string): void {
    this.fetchConsoles();
    this.isConsoleReady$ = this.consoles$.pipe(
      map((consoles) => {
        if (consoles.length > 0) {
          return consoles.find((console) => console.name == event) !== undefined;
        }
      })
    );
  }

  onShowContainers(event: boolean): void {
    setTimeout(() => (this.showLegendContainers = event), 100);
  }

  fetchConsoles(): void {
    const observable$: Observable<ConsoleUrl[]> = this.topologyApiService.getVMConsolesUrl(this.sandboxUuid);
    this.resourcePollingService
      .startPolling(observable$, this.configService.config.pollingPeriod, this.configService.config.retryAttempts, true)
      .pipe(
        takeWhile(() => this.pollingSubject$.getValue()),
        catchError(() => EMPTY)
      )
      .subscribe();
  }

  /**
   * Reloads topology and its decorators.
   */
  reloadTopology() {
    this.isError = false;
    this.loadTopology();
    if (this.configService.config.useDecorators && this.decoratorReloadTimerService.getReloadPeriod() > 0) {
      setTimeout(() => this.loadAllDecorators(), 100);
    }
  }

  /**
   * Calls topology loader service and updates attributes based on result
   */
  loadTopology() {
    this.dataLoaded = false;
    let topologyRequest;
    if (this.sandboxUuid) {
      topologyRequest = this.topologyLoaderService.getTopologyBySandboxInstanceId(this.sandboxUuid);
    } else if (this.sandboxDefinitionId) {
      topologyRequest = this.topologyLoaderService.getTopologyBySandboxDefinitionId(this.sandboxDefinitionId);
    }
    topologyRequest.subscribe(
      (data) => {
        this.nodes = data.nodes;
        this.links = data.links;
        this.dataLoaded = true;
        this.topologyLoadEmitter.emit(true);
      },
      (err) => {
        this.isError = true;
      }
    );
  }

  /**
   * Calls service to load decorators with node and link ids
   */
  loadAllDecorators() {
    this.decoratorLoaderService.loadAllDecorators(
      this.getHostNodeNames(),
      this.getRouterNodeNames(),
      this.getLinkNames()
    );
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
        this.processDecoratorRouterReload(reloadEvent.names, reloadEvent.decoratorType as RouterNodeDecoratorTypeEnum);
        break;
      }
      case DecoratorCategoryEnum.HostDecorators: {
        this.processDecoratorHostReload(reloadEvent.names, reloadEvent.decoratorType as HostNodeDecoratorTypeEnum);
        break;
      }
      case DecoratorCategoryEnum.LinkDecorators: {
        this.processDecoratorLinkReload(reloadEvent.names, reloadEvent.decoratorType as LinkDecoratorTypeEnum);
        break;
      }
    }
  }

  /**
   * Processes request to reload router decorator of certain type
   * @param {string[]} names array of ids of elements whose decorators should be reloaded. If null all ids are used
   * @param {RouterNodeDecoratorTypeEnum} decoratorType decorator type which should be reloaded.
   * If null all active decorator types are reloaded
   */
  private processDecoratorRouterReload(names: string[], decoratorType: RouterNodeDecoratorTypeEnum) {
    if ((names === null || names.length <= 0) && decoratorType == null) {
      this.decoratorLoaderService.loadRouterNodeDecorators(this.getRouterNodeNames());
    } else if (names === null || names.length <= 0) {
      this.decoratorLoaderService.loadRouterDecoratorsOfType(this.getRouterNodeNames(), decoratorType);
    } else if (decoratorType === null) {
      this.decoratorLoaderService.loadRouterNodeDecorators(names);
    } else {
      this.decoratorLoaderService.loadRouterDecoratorsOfType(names, decoratorType);
    }
  }

  /**
   * Processes request to reload host decorator of certain type
   * @param {string[]} names array of names of elements whose decorators should be reloaded. If null all names are used
   * @param {HostNodeDecoratorTypeEnum} decoratorType decorator type which should be reloaded.
   * If null all active decorator types are reloaded
   */
  private processDecoratorHostReload(names: string[], decoratorType: HostNodeDecoratorTypeEnum) {
    if ((names === null || names.length <= 0) && decoratorType == null) {
      this.decoratorLoaderService.loadHostNodeDecorators(this.getHostNodeNames());
    } else if (names === null || names.length <= 0) {
      this.decoratorLoaderService.loadHostDecoratorsOfType(this.getHostNodeNames(), decoratorType);
    } else if (decoratorType === null) {
      this.decoratorLoaderService.loadHostNodeDecorators(names);
    } else {
      this.decoratorLoaderService.loadHostDecoratorsOfType(names, decoratorType);
    }
  }

  /**
   * Process request to reload link decorator of certain type
   * @param {string[]} names array of names of elements whose decorators should be reloaded. If null all names are used
   * @param {LinkDecoratorTypeEnum} decoratorType decorator type which should be reloaded.
   * If null all active decorator types are reloaded
   */
  private processDecoratorLinkReload(names: string[], decoratorType: LinkDecoratorTypeEnum) {
    if ((names === null || names.length <= 0) && decoratorType == null) {
      this.decoratorLoaderService.loadLinkDecorators(this.getLinkNames());
    } else if (names === null || names.length <= 0) {
      this.decoratorLoaderService.loadLinkDecoratorsOfType(this.getLinkNames(), decoratorType);
    } else if (decoratorType === null) {
      this.decoratorLoaderService.loadLinkDecorators(names);
    } else {
      this.decoratorLoaderService.loadLinkDecoratorsOfType(names, decoratorType);
    }
  }

  /**
   * Method to find and return all names of host nodes in graph-visual.
   * @returns {number[]} array of host nodes names
   */
  private getHostNodeNames(): string[] {
    if (this.nodes === null || this.nodes === undefined || this.nodes.length === 0) {
      return [];
    }
    return this.nodes.filter((node) => node instanceof HostNode).map(({ name }) => name);
  }

  /**
   * Method to find and return all names of router nodes in graph-visual
   * @returns {number[]} array of router nodes names
   */
  private getRouterNodeNames(): string[] {
    if (this.nodes === null || this.nodes === undefined || this.nodes.length === 0) {
      return [];
    }
    return this.nodes.filter((node) => node instanceof RouterNode).map(({ name }) => name);
  }

  /**
   * Method to find and return all ids of links in graph-visual
   * @returns {number[]} array of link ids
   */
  private getLinkNames(): string[] {
    if (this.nodes === null || this.nodes === undefined || this.nodes.length === 0) {
      return [];
    }
    return this.links.map(({ id }) => id.toString());
  }

  /**
   * Subscribes to periodical reload of decorators
   */
  private subscribeDecoratorsPeriodicalReload() {
    if (this.configService.config.defaultDecoratorRefreshPeriodInSeconds > 0) {
      this._decoratorPeriodicalReloadSubscription = interval(
        this.configService.config.defaultDecoratorRefreshPeriodInSeconds * 1000
      ).subscribe(() => {
        this.reloadAllDecorators();
      });
    }
  }

  /**
   * Subscribes to decorator period timer
   */
  private subscribeDecoratorTimer() {
    this._decoratorTimerSubscription = this.decoratorReloadTimerService.onReloadPeriodChange.subscribe(
      (reloadPeriod) => {
        if (reloadPeriod > 0) {
          if (this._decoratorPeriodicalReloadSubscription) {
            this._decoratorPeriodicalReloadSubscription.unsubscribe();
          }

          this._decoratorPeriodicalReloadSubscription = interval(reloadPeriod * 1000).subscribe(() => {
            this.reloadAllDecorators();
          });
        } else {
          if (this._decoratorPeriodicalReloadSubscription) {
            this._decoratorPeriodicalReloadSubscription.unsubscribe();
          }
        }
      }
    );
  }
  /**
   * Subscribes to error in decorator loader
   */
  private subscribeDecoratorError() {
    this._decoratorLoadErrorSubscription = this.decoratorLoaderService.decoratorLoaderError.subscribe((value) => {
      const snackRef = this.snackBar.open('Decorators failed to load: ' + value, 'Try again');
      snackRef._dismissAfter(5000);
      snackRef.onAction().subscribe(() => this.reloadAllDecorators());
    });
  }

  /**
   * Subscribes to decorator reload events
   */
  private subscribeDecoratorReloadEvent() {
    this._decoratorReloadSubscription = this.decoratorEventService.onDecoratorReloadRequest.subscribe((reloadEvent) => {
      this.processDecoratorReloadRequest(reloadEvent);
    });
  }

  /**
   * Subscribes to zoom change events
   */
  private subscribeZoomChangeEvent() {
    this._zoomResetSubscription = this.d3ZoomEventService.onZoomChange.subscribe((value) => {
      if (value !== 1) {
        this.showZoomResetButton = true;
      }
    });
  }

  private subscribeDragNodeEvents() {
    this._nodeTouchedSubscription = this.draggedNodeService.onNodeTouched.subscribe((node) => {
      // TODO
    });
    this._nodeDraggedSubscription = this.draggedNodeService.onNodeDragStarted.subscribe((node) => {
      this.draggedNode = node;
    });
    this._nodeDragEndedSubscription = this.draggedNodeService.onNodeDragEnded.subscribe((node) => {
      this.draggedNode = null;
    });
  }

  private subscribeLoading() {
    this.isLoading$ = this.loadingService.isLoading$;
  }

  isCloudSandboxInstance(): boolean {
    return this.sandboxUuid !== undefined && this.sandboxUuid !== null;
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
    if (this._nodeTouchedSubscription) {
      this._nodeTouchedSubscription.unsubscribe();
    }
    if (this._nodeDraggedSubscription) {
      this._nodeDraggedSubscription.unsubscribe();
    }
    if (this._nodeDragEndedSubscription) {
      this._nodeDragEndedSubscription.unsubscribe();
    }
  }
}
