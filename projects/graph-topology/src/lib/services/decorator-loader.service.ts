import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, forkJoin, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {LinkDecorator} from '../model/decorators/link-decorator';
import {NodeDecorator} from '../model/decorators/node-decorator';
import {NodeSemaphoreDecorator} from '../model/decorators/node-semaphore-decorator';
import {NodeStatusDecorator} from '../model/decorators/node-status-decorator';
import {StatusEnum} from '../model/enums/status-enum';
import {NodeLogicalRoleDecorator} from '../model/decorators/node-logical-role-decorator';
import {NodeLogicalRoleEnum} from '../model/enums/node-logical-role-enum';
import {NodeSemaphoreDecoratorStatusEnum} from '../model/enums/node-semaphore-decorator-status-enum';
import {HostNodeDecoratorTypeEnum} from '../model/enums/host-node-decorator-type-enum';
import {RouterNodeDecoratorTypeEnum} from '../model/enums/router-node-decorator-type-enum';
import {LinkDecoratorTypeEnum} from '../model/enums/link-decorator-type-enum';
import {DecoratorEventService} from './decorator-event.service';
import {DecoratorFilterService} from './decorator-filter.service';
import {DecoratorCategoryEnum} from '../model/enums/decorator-category-enum';
import {DecoratorReloadTimerService} from './decorator-reload-timer.service';
import {LinkSpeedDecorator} from '../model/decorators/link-speed-decorator';
import {LinkMailDecorator} from '../model/decorators/link-mail-decorator';
import {StringToEnumConverter} from '../others/string-to-enum-converter';
import {EnumToStringConverter} from '../others/enum-to-string-converter';
import {DecoratorHttpPostBody} from '../model/others/decorator-http-post-body';
import {DecoratorTimeService} from './decorator-time.service';
import {DecoratorStateService} from './decorator-state.service';
import {map} from 'rxjs/operators';
import {ConfigService} from './config.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


/**
 * Service is used for loading decorators from server, creating objects based on received data and passing the decorators to application.
 * Decorators can be filtered. If user doesn't want to display them there is no need to retrieve them from backend.
 */
@Injectable()
export class DecoratorLoaderService {

  private _decoratorLoaderErrorSubject: Subject<string> = new Subject();
  decoratorLoaderError: Observable<string> = this._decoratorLoaderErrorSubject.asObservable();

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private decoratorEventService: DecoratorEventService,
              private decoratorsFilterService: DecoratorFilterService,
              private decoratorTimeService: DecoratorTimeService,
              private decoratorStateService: DecoratorStateService) {
  }

  /**Loads decorators for router, host nodes and links
   * Receives IDs of nodes and links whose decorators should be retrieved.
   * @param {number[]} hostNodeIds IDs of host nodes whose decorators should be retrieved
   * @param {number[]} routerNodeIds IDs of router nodes whose decorators should be retrieved
   * @param {number[]} linkIds IDs of links whose decorators should be retrieved
   */
  loadAllDecorators(hostNodeIds: number[], routerNodeIds: number[], linkIds: number[]) {
    this.loadRouterNodeDecorators(routerNodeIds);
    this.loadHostNodeDecorators(hostNodeIds);
    this.loadLinkDecorators(linkIds);
  }

  /**
   * Loads decorators for router nodes
   * @param {number[]} routerNodeIds IDs of router nodes whose decorators should be retrieved
   */
  loadRouterNodeDecorators(routerNodeIds: number[]) {
    const routerNodeDecoratorTypes: RouterNodeDecoratorTypeEnum[] = this.decoratorsFilterService.getActiveRouterDecorators();
    if (routerNodeIds != null && routerNodeIds.length > 0) {
      this.passRouterNodeDecoratorsToGraph(
        this.retrieveRouterNodeDecorators(routerNodeIds, routerNodeDecoratorTypes),
        routerNodeDecoratorTypes);
    }
  }

  /**
   * Loads decorators for host nodes
   * @param {number[]} hostNodeIds IDs of host nodes whose decorators should be retrieved
   */
  loadHostNodeDecorators(hostNodeIds: number[]) {
    const hostNodeDecoratorTypes: HostNodeDecoratorTypeEnum[] = this.decoratorsFilterService.getActiveHostDecorators();
    if (hostNodeIds != null && hostNodeIds.length > 0) {
      this.passHostNodeDecoratorsToGraph(
        this.retrieveHostNodeDecorators(hostNodeIds, hostNodeDecoratorTypes), hostNodeDecoratorTypes);
    }
  }

  /**
   * Loads decorators for links
   * @param {number[]} linkIds IDs of links whose decorators should be retrieved
   */
  loadLinkDecorators(linkIds: number[]) {
    const linkDecoratorTypes: LinkDecoratorTypeEnum[] = this.decoratorsFilterService.getActiveLinkDecorators();
    if (linkIds != null && linkIds.length > 0) {
      this.passLinkDecoratorsToGraph(this.retrieveLinkDecorators(linkIds, linkDecoratorTypes), linkDecoratorTypes);
    }
  }

  /**
   * Loads decorators of certain type for router nodes
   * @param {number[]} routerNodeIds IDs of router nodes whose decorators should be retrieved
   * @param {RouterNodeDecoratorTypeEnum} decoratorType type of decorator which should be retrieved
   */
  loadRouterDecoratorsOfType(routerNodeIds: number[], decoratorType: RouterNodeDecoratorTypeEnum) {
    if (routerNodeIds != null && routerNodeIds.length > 0) {
      this.passRouterNodeDecoratorsToGraph(this.retrieveRouterNodeDecorators(routerNodeIds, [decoratorType]), [decoratorType]);
      }
  }

  /**
   * Loads decorators of certain type for host nodes
   * @param {number[]} hostNodeIds IDs of host nodes whose decorators should be retrieved
   * @param {HostNodeDecoratorTypeEnum} decoratorType type of decorator which should be retrieved
   */
  loadHostDecoratorsOfType(hostNodeIds: number[], decoratorType: HostNodeDecoratorTypeEnum) {
    if (hostNodeIds != null && hostNodeIds.length > 0) {
      this.passHostNodeDecoratorsToGraph(this.retrieveHostNodeDecorators(hostNodeIds, [decoratorType]), [decoratorType]);
    }
  }

  /**
   * Loads decorators of certain type for links
   * @param {number[]} linkIds IDs of links whose decorators should be retrieved
   * @param {LinkDecoratorTypeEnum} decoratorType type of decorator which should be retrieved
   */
  loadLinkDecoratorsOfType(linkIds: number[], decoratorType: LinkDecoratorTypeEnum) {
    if (linkIds != null && linkIds.length > 0) {
      this.passLinkDecoratorsToGraph(this.retrieveLinkDecorators(linkIds, [decoratorType]), [decoratorType]);
    }
  }

  /**
   * Retrieves host node decorators for every id based on desired decorator types
   * @param {number[]} hostNodeIds list of node ids which decorators should be retrieved
   * @param {HostNodeDecoratorTypeEnum[]} hostNodeDecoratorTypes types of decorators which should be retrieved
   * @returns {Observable<NodeDecorator[]>[]} list of observables returned from requests
   */
  private retrieveHostNodeDecorators(hostNodeIds: number[],
                                     hostNodeDecoratorTypes: HostNodeDecoratorTypeEnum[]): Observable<NodeDecorator[]>[] {
    const observablesToReturn: Observable<NodeDecorator[]>[] = [];
    const url = this.configService.conf.decoratorsRestUrl + '/nodes/decorators';
    const from = this.decoratorTimeService.getFromTime();
    const to = this.decoratorTimeService.getToTime();

    // for each not-filtered decorator type
    for (const hostNodeDecoratorType of hostNodeDecoratorTypes) {
      // create request body here
      const requestBody = new DecoratorHttpPostBody(
        EnumToStringConverter.decoratorEnumToRestString(DecoratorCategoryEnum.HostDecorators, hostNodeDecoratorType),
        hostNodeIds,
        from,
        to);

      console.log(requestBody);
      // send post request and parse it with appropriate method
      switch (hostNodeDecoratorType) {
        case HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator : {
/*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseNodeLogicalRoleDecorators(response))
          );*/
          break;
        }
        case HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator : {
/*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseNodeSemaphoreDecorators(response))
          );*/
          break;
        }
        case HostNodeDecoratorTypeEnum.NodeStatusDecorator : {
/*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseNodeStatusDecorators(response))
          );*/
          break;
        }
      }
    }
    return observablesToReturn;
  }

  /**
   * Retrieves router node decorators for every id based on desired decorator types
   * @param {number[]} routerNodeIds list of node ids which decorators should be retrieved
   * @param {RouterNodeDecoratorTypeEnum[]} routerNodeDecoratorTypes types of decorators which should be retrieved
   * @returns {Observable<NodeDecorator[]>[] list of observables returned from requests
   */
  private retrieveRouterNodeDecorators(routerNodeIds: number[],
                                       routerNodeDecoratorTypes: RouterNodeDecoratorTypeEnum[]): Observable<NodeDecorator[]>[] {

    const observablesToReturn: Observable<NodeDecorator[]>[] = [];
    const url = this.configService.conf.decoratorsRestUrl + '/nodes/decorators';
    const from = this.decoratorTimeService.getFromTime();
    const to = this.decoratorTimeService.getToTime();

    for (const routerNodeDecoratorType of routerNodeDecoratorTypes) {

      const requestBody = new DecoratorHttpPostBody(
        EnumToStringConverter.decoratorEnumToRestString(DecoratorCategoryEnum.RouterDecorators, routerNodeDecoratorType),
        routerNodeIds,
        from,
        to);
      console.log(requestBody);

      switch (routerNodeDecoratorType) {
        case RouterNodeDecoratorTypeEnum.LogicalRoleDecorator: {
/*          observablesToReturn.push(
              this.http.post(url, requestBody, httpOptions)
                .map(response => this.parseNodeLogicalRoleDecorators(response))
            );*/
          break;
        }
        default:
          break;
      }
    }

    return observablesToReturn;
  }

  /**
   * Retrieves link decorators for every id based on desired decorator types
   * @param {number[]} linkIds list of link ids which decorators should be retrieved
   * @param {LinkDecoratorTypeEnum[]} linkDecoratorTypes types of decorators which should be retrieved
   * @returns {Observable<LinkDecorator[]>[]} list of observables returned from requests
   */
  private retrieveLinkDecorators(linkIds: number[], linkDecoratorTypes: LinkDecoratorTypeEnum[]): Observable<LinkDecorator[]>[] {

    const observablesToReturn: Observable<LinkDecorator[]>[] = [];
    const url = this.configService.conf.decoratorsRestUrl + '/links/decorators';
    const from = this.decoratorTimeService.getFromTime();
    const to = this.decoratorTimeService.getToTime();

    for (const linkDecoratorType of linkDecoratorTypes) {

      const requestBody = new DecoratorHttpPostBody(
        EnumToStringConverter.decoratorEnumToRestString(DecoratorCategoryEnum.LinkDecorators, linkDecoratorType),
        linkIds,
        from,
        to);

       console.log(requestBody);

      switch (linkDecoratorType) {
        case LinkDecoratorTypeEnum.LinkSpeedDecorator : {
          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .pipe(map(
                response => this.parseLinkSpeedDecorators(response)
              )));
          break;
        }
        case LinkDecoratorTypeEnum.LinkMailDecorator : {
/*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseLinkMailDecorators(response))
          );*/
          break;
        }
        default : {
          break;
        }
      }
    }
    return observablesToReturn;
  }

  /**
   * Creates node status decorators based on json data
   * @param json json data retrieved from server request
   * @returns {NodeDecorator[]} created objects with values from json
   */
  private parseNodeStatusDecorators(json): NodeDecorator[] {
    const nodeDecorators: NodeDecorator[] = [];
    for (const decorator of json.nodes_decorators) {
      nodeDecorators.push(new NodeStatusDecorator(decorator.node_id, StringToEnumConverter.statusStringToEnum(decorator.value)));
    }
    return nodeDecorators;
  }

  /**
   * Creates node semaphore decorators based on json data
   * @param json json data retrieved from server request
   * @returns {NodeDecorator[]} created objects with values from json
   */
  private parseNodeSemaphoreDecorators(json): NodeDecorator[] {
    const nodeDecorators: NodeDecorator[] = [];
    for (const decorator of json.nodes_decorators) {
      nodeDecorators.push(new NodeSemaphoreDecorator(decorator.node_id, StringToEnumConverter.statusSemaphoreStringToEnum(decorator.value)));
    }
    return nodeDecorators;
  }

  /**
   * Creates node logical role decorators based on json data
   * @param json json data retrieved from server request
   * @returns {NodeDecorator[]} created objects with values from json
   */
  private parseNodeLogicalRoleDecorators(json): NodeDecorator[] {
    const nodeDecorators: NodeDecorator[] = [];
    for (const decorator of json.nodes_decorators) {
      if (decorator.value) {
        nodeDecorators.push(new NodeLogicalRoleDecorator(decorator.node_id,
          StringToEnumConverter.logicalRoleStringToEnum(decorator.value)));
      }
    }
    return nodeDecorators;
  }

  /**
   * Creates link mail decorators based on json data
   * @param json json data retrieved from server request
   * @returns {LinkDecorator[]} created objects with values from json
   */
  private parseLinkMailDecorators(json): LinkDecorator[] {
    const linkDecorators: LinkDecorator[] = [];
    for (const decorator of json.links_decorators) {
      linkDecorators.push(new LinkMailDecorator(decorator.link_id, decorator.value));
    }
    return linkDecorators;
  }

  /**
   * Creates link speed decorators based on json data
   * @param json json data retrieved from server request
   * @returns {LinkDecorator[]} created objects with values from json
   */
  private parseLinkSpeedDecorators(json): LinkDecorator[] {
    const linkDecorators: LinkDecorator[] = [];
    for (const decorator of json.links_decorators) {
      if (decorator.value > 0) {
        linkDecorators.push(new LinkSpeedDecorator(decorator.link_id, decorator.value));
      }
    }
    return linkDecorators;
  }

  /**
   * Flattens results from multiple server requests and triggers events to notify visual components about changes
   * @param {Observable<NodeDecorator[]>[]} nodeObservables array of all observables of node decorators from server requests
   * @param {RouterNodeDecoratorTypeEnum[]} decoratorTypes array of reloaded decorator types
   */
  private passRouterNodeDecoratorsToGraph(nodeObservables: Observable<NodeDecorator[]>[], decoratorTypes: RouterNodeDecoratorTypeEnum[]) {
    const nodeDecorators: NodeDecorator[] = [];

    // testData
/*    nodeDecorators.push(new NodeLogicalRoleDecorator(11, NodeLogicalRoleEnum.Victim));*/

    // forkJoin processes multiple observables and flattens the result to node and link arrays.
    // When flattening is completed event is triggered
    forkJoin(nodeObservables)
      .subscribe(
        responses => responses
          .forEach(decorators => {
            decorators.forEach(dec => nodeDecorators.push(dec));
          }),
        err => {
          console.log(err);
          this.triggerDecoratorLoadError();
          this.decoratorStateService.setActive(false);
          this.decoratorEventService
            .triggerNodeDecoratorsRemoved(DecoratorCategoryEnum.RouterDecorators, this.decoratorsFilterService.getActiveRouterDecorators());
        },
            () => this.decoratorEventService.
            triggerNodeDecoratorsLoaded(DecoratorCategoryEnum.RouterDecorators, decoratorTypes, nodeDecorators)
        );
  }

  /**
   * Flattens results from multiple server requests and triggers events to notify visual components about changes
   * @param {Observable<NodeDecorator[]>[]} nodeObservables array of all observables of node decorators from server requests
   * @param {HostNodeDecoratorTypeEnum[]} decoratorTypes array of reloaded decorator types
   */
  private passHostNodeDecoratorsToGraph(nodeObservables: Observable<NodeDecorator[]>[], decoratorTypes: HostNodeDecoratorTypeEnum[]) {
    const nodeDecorators: NodeDecorator[] = [];

    // testData
/*        nodeDecorators.push(new NodeLogicalRoleDecorator(4, NodeLogicalRoleEnum.Attacker));
        nodeDecorators.push(new NodeSemaphoreDecorator(4, NodeSemaphoreDecoratorStatusEnum.Orange));
        nodeDecorators.push(new NodeStatusDecorator(4, StatusEnum.Online));*/

    // forkJoin processes multiple observables and flattens the result to node and link arrays.
    // When flattening is completed event is triggered
    forkJoin(nodeObservables)
      .subscribe(
        responses => responses
          .forEach(decorators => {
            decorators.forEach(dec => nodeDecorators.push(dec));
          }),
        err => {
          console.log(err);
          this.triggerDecoratorLoadError();
          this.decoratorStateService.setActive(false);
          this.decoratorEventService
            .triggerNodeDecoratorsRemoved(DecoratorCategoryEnum.HostDecorators, this.decoratorsFilterService.getActiveHostDecorators());
        },
        () => this.decoratorEventService.triggerNodeDecoratorsLoaded(DecoratorCategoryEnum.HostDecorators, decoratorTypes, nodeDecorators)
      );
  }

  /**
   * Flattens results from multiple server requests and triggers events to notify visual components about changes
   * @param {Observable<LinkDecorator[]>[]} linkObservables array of all observable of link decorators from server requests
   * @param {LinkDecoratorTypeEnum[]} decoratorTypes array of reloaded decorator types
   */
  private passLinkDecoratorsToGraph(linkObservables: Observable<LinkDecorator[]>[], decoratorTypes: LinkDecoratorTypeEnum[]) {
    const linkDecorators: LinkDecorator[] = [];

    // testData
/*    linkDecorators.push(new LinkMailDecorator(25, 100));
    linkDecorators.push(new LinkMailDecorator(24, 1000000));*/

    forkJoin(linkObservables)
      .subscribe(
        responses => responses
          .forEach(decorators => decorators
            .forEach(dec => linkDecorators.push(dec))),
        err => {
          console.log(err);
          this.triggerDecoratorLoadError();
          this.decoratorStateService.setActive(false);
          this.decoratorEventService
            .triggerLinkDecoratorsRemoved(DecoratorCategoryEnum.LinkDecorators, this.decoratorsFilterService.getActiveLinkDecorators());
        },
        () => {
          this.decoratorEventService.triggerLinkDecoratorsLoaded(DecoratorCategoryEnum.LinkDecorators, decoratorTypes, linkDecorators);
        }
      );
  }
  /**
   * Triggers node decorator load error event
   */
  private triggerDecoratorLoadError() {
    this._decoratorLoaderErrorSubject.next('Could not retrieve decorator data from server');
  }



}
