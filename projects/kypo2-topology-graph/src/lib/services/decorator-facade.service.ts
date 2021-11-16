import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LinkDecorator } from '../model/decorators/link-decorator';
import { NodeDecorator } from '../model/decorators/node-decorator';
import { NodeSemaphoreDecorator } from '../model/decorators/node-semaphore-decorator';
import { NodeStatusDecorator } from '../model/decorators/node-status-decorator';
import { NodeLogicalRoleDecorator } from '../model/decorators/node-logical-role-decorator';
import { HostNodeDecoratorTypeEnum } from '../model/enums/host-node-decorator-type-enum';
import { RouterNodeDecoratorTypeEnum } from '../model/enums/router-node-decorator-type-enum';
import { LinkDecoratorTypeEnum } from '../model/enums/link-decorator-type-enum';
import { DecoratorEventService } from './decorator-event.service';
import { DecoratorFilterService } from './decorator-filter.service';
import { DecoratorCategoryEnum } from '../model/enums/decorator-category-enum';
import { LinkSpeedDecorator } from '../model/decorators/link-speed-decorator';
import { LinkMailDecorator } from '../model/decorators/link-mail-decorator';
import { StringToEnumConverter } from '../others/string-to-enum-converter';
import { EnumToStringConverter } from '../others/enum-to-string-converter';
import { DecoratorHttpPostBody } from '../model/others/decorator-http-post-body';
import { DecoratorTimeService } from './decorator-time.service';
import { DecoratorStateService } from './decorator-state.service';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

/**
 * Service is used for loading decorators from server, creating objects based on received data and passing the decorators to application.
 * Decorators can be filtered. If user doesn't want to display them there is no need to retrieve them from backend.
 */
@Injectable()
export class DecoratorFacade {
  private _decoratorLoaderErrorSubject: Subject<string> = new Subject();
  decoratorLoaderError: Observable<string> = this._decoratorLoaderErrorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private decoratorEventService: DecoratorEventService,
    private decoratorsFilterService: DecoratorFilterService,
    private decoratorTimeService: DecoratorTimeService,
    private decoratorStateService: DecoratorStateService
  ) {}

  /**Loads decorators for router, host nodes and links
   * Receives names of nodes and links whose decorators should be retrieved.
   * @param {number[]} hostNodeNames names of host nodes whose decorators should be retrieved
   * @param {number[]} routerNodeNames names of router nodes whose decorators should be retrieved
   * @param {number[]} linkNames names of links whose decorators should be retrieved
   */
  loadAllDecorators(hostNodeNames: string[], routerNodeNames: string[], linkNames: string[]) {
    this.loadHostNodeDecorators(hostNodeNames);
    this.loadRouterNodeDecorators(routerNodeNames);
    this.loadLinkDecorators(linkNames);
  }

  /**
   * Loads decorators for router nodes
   * @param {string[]} routerNodeNames names of router nodes whose decorators should be retrieved
   */
  loadRouterNodeDecorators(routerNodeNames: string[]) {
    const routerNodeDecoratorTypes: RouterNodeDecoratorTypeEnum[] = this.decoratorsFilterService.getActiveRouterDecorators();
    if (routerNodeNames != null && routerNodeNames.length > 0) {
      this.passRouterNodeDecoratorsToGraph(
        this.retrieveRouterNodeDecorators(routerNodeNames, routerNodeDecoratorTypes),
        routerNodeDecoratorTypes
      );
    }
  }

  /**
   * Loads decorators for host nodes
   * @param {string[]} hostNodeNames names of host nodes whose decorators should be retrieved
   */
  loadHostNodeDecorators(hostNodeNames: string[]) {
    const hostNodeDecoratorTypes: HostNodeDecoratorTypeEnum[] = this.decoratorsFilterService.getActiveHostDecorators();
    if (hostNodeNames != null && hostNodeNames.length > 0) {
      this.passHostNodeDecoratorsToGraph(
        this.retrieveHostNodeDecorators(hostNodeNames, hostNodeDecoratorTypes),
        hostNodeDecoratorTypes
      );
    }
  }

  /**
   * Loads decorators for links
   * @param {string[]} linkNames IDs of links whose decorators should be retrieved
   */
  loadLinkDecorators(linkNames: string[]) {
    const linkDecoratorTypes: LinkDecoratorTypeEnum[] = this.decoratorsFilterService.getActiveLinkDecorators();
    if (linkNames != null && linkNames.length > 0) {
      this.passLinkDecoratorsToGraph(this.retrieveLinkDecorators(linkNames, linkDecoratorTypes), linkDecoratorTypes);
    }
  }

  /**
   * Loads decorators of certain type for router nodes
   * @param {string[]} routerNodeNames names of router nodes whose decorators should be retrieved
   * @param {RouterNodeDecoratorTypeEnum} decoratorType type of decorator which should be retrieved
   */
  loadRouterDecoratorsOfType(routerNodeNames: string[], decoratorType: RouterNodeDecoratorTypeEnum) {
    if (routerNodeNames != null && routerNodeNames.length > 0) {
      this.passRouterNodeDecoratorsToGraph(this.retrieveRouterNodeDecorators(routerNodeNames, [decoratorType]), [
        decoratorType,
      ]);
    }
  }

  /**
   * Loads decorators of certain type for host nodes
   * @param {string[]} hostNodeNames names of host nodes whose decorators should be retrieved
   * @param {HostNodeDecoratorTypeEnum} decoratorType type of decorator which should be retrieved
   */
  loadHostDecoratorsOfType(hostNodeNames: string[], decoratorType: HostNodeDecoratorTypeEnum) {
    if (hostNodeNames != null && hostNodeNames.length > 0) {
      this.passHostNodeDecoratorsToGraph(this.retrieveHostNodeDecorators(hostNodeNames, [decoratorType]), [
        decoratorType,
      ]);
    }
  }

  /**
   * Loads decorators of certain type for links
   * @param {string[]} linkNames names of links whose decorators should be retrieved
   * @param {LinkDecoratorTypeEnum} decoratorType type of decorator which should be retrieved
   */
  loadLinkDecoratorsOfType(linkNames: string[], decoratorType: LinkDecoratorTypeEnum) {
    if (linkNames != null && linkNames.length > 0) {
      this.passLinkDecoratorsToGraph(this.retrieveLinkDecorators(linkNames, [decoratorType]), [decoratorType]);
    }
  }

  /**
   * Retrieves host node decorators for every id based on desired decorator types
   * @param {string[]} hostNodeNames list of node names which decorators should be retrieved
   * @param {HostNodeDecoratorTypeEnum[]} hostNodeDecoratorTypes types of decorators which should be retrieved
   * @returns {Observable<NodeDecorator[]>[]} list of observables returned from requests
   */
  private retrieveHostNodeDecorators(
    hostNodeNames: string[],
    hostNodeDecoratorTypes: HostNodeDecoratorTypeEnum[]
  ): Observable<NodeDecorator[]>[] {
    const observablesToReturn: Observable<NodeDecorator[]>[] = [];
    const url = this.configService.config.decoratorsRestUrl + '/nodes/decorators';
    const from = this.decoratorTimeService.getFromTime();
    const to = this.decoratorTimeService.getToTime();

    // for each not-filtered decorator type
    for (const hostNodeDecoratorType of hostNodeDecoratorTypes) {
      // create request body here
      const requestBody = new DecoratorHttpPostBody(
        EnumToStringConverter.decoratorEnumToRestString(DecoratorCategoryEnum.HostDecorators, hostNodeDecoratorType),
        hostNodeNames,
        from,
        to
      );

      // send post request and parse it with appropriate method
      switch (hostNodeDecoratorType) {
        case HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator: {
          /*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseNodeLogicalRoleDecorators(response))
          );*/
          break;
        }
        case HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator: {
          /*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseNodeSemaphoreDecorators(response))
          );*/
          break;
        }
        case HostNodeDecoratorTypeEnum.NodeStatusDecorator: {
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
   * @param {string[]} routerNodeNames list of node names which decorators should be retrieved
   * @param {RouterNodeDecoratorTypeEnum[]} routerNodeDecoratorTypes types of decorators which should be retrieved
   * @returns {Observable<NodeDecorator[]>[] list of observables returned from requests
   */
  private retrieveRouterNodeDecorators(
    routerNodeNames: string[],
    routerNodeDecoratorTypes: RouterNodeDecoratorTypeEnum[]
  ): Observable<NodeDecorator[]>[] {
    const observablesToReturn: Observable<NodeDecorator[]>[] = [];
    const url = this.configService.config.decoratorsRestUrl + '/nodes/decorators';
    const from = this.decoratorTimeService.getFromTime();
    const to = this.decoratorTimeService.getToTime();

    for (const routerNodeDecoratorType of routerNodeDecoratorTypes) {
      const requestBody = new DecoratorHttpPostBody(
        EnumToStringConverter.decoratorEnumToRestString(
          DecoratorCategoryEnum.RouterDecorators,
          routerNodeDecoratorType
        ),
        routerNodeNames,
        from,
        to
      );

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
   * @param {string[]} linkNames list of link ids which decorators should be retrieved
   * @param {LinkDecoratorTypeEnum[]} linkDecoratorTypes types of decorators which should be retrieved
   * @returns {Observable<LinkDecorator[]>[]} list of observables returned from requests
   */
  private retrieveLinkDecorators(
    linkNames: string[],
    linkDecoratorTypes: LinkDecoratorTypeEnum[]
  ): Observable<LinkDecorator[]>[] {
    const observablesToReturn: Observable<LinkDecorator[]>[] = [];
    const url = this.configService.config.decoratorsRestUrl + '/links/decorators';
    const from = this.decoratorTimeService.getFromTime();
    const to = this.decoratorTimeService.getToTime();

    for (const linkDecoratorType of linkDecoratorTypes) {
      const requestBody = new DecoratorHttpPostBody(
        EnumToStringConverter.decoratorEnumToRestString(DecoratorCategoryEnum.LinkDecorators, linkDecoratorType),
        linkNames,
        from,
        to
      );

      switch (linkDecoratorType) {
        case LinkDecoratorTypeEnum.LinkSpeedDecorator: {
          observablesToReturn.push(
            this.http
              .post(url, requestBody, httpOptions)
              .pipe(map((response) => this.parseLinkSpeedDecorators(response)))
          );
          break;
        }
        case LinkDecoratorTypeEnum.LinkMailDecorator: {
          /*          observablesToReturn.push(
            this.http.post(url, requestBody, httpOptions)
              .map(response => this.parseLinkMailDecorators(response))
          );*/
          break;
        }
        default: {
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
      nodeDecorators.push(
        new NodeStatusDecorator(decorator.node_id, StringToEnumConverter.statusStringToEnum(decorator.value))
      );
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
      nodeDecorators.push(
        new NodeSemaphoreDecorator(
          decorator.node_id,
          StringToEnumConverter.statusSemaphoreStringToEnum(decorator.value)
        )
      );
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
        nodeDecorators.push(
          new NodeLogicalRoleDecorator(
            decorator.node_id,
            StringToEnumConverter.logicalRoleStringToEnum(decorator.value)
          )
        );
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
  private passRouterNodeDecoratorsToGraph(
    nodeObservables: Observable<NodeDecorator[]>[],
    decoratorTypes: RouterNodeDecoratorTypeEnum[]
  ) {
    const nodeDecorators: NodeDecorator[] = [];

    // testData
    /*    nodeDecorators.push(new NodeLogicalRoleDecorator(11, NodeLogicalRoleEnum.Victim));*/

    // forkJoin processes multiple observables and flattens the result to node and link arrays.
    // When flattening is completed event is triggered
    forkJoin(nodeObservables).subscribe(
      (responses) =>
        responses.forEach((decorators) => {
          decorators.forEach((dec) => nodeDecorators.push(dec));
        }),
      (err) => {
        this.triggerDecoratorLoadError();
        this.decoratorStateService.setActive(false);
        this.decoratorEventService.triggerNodeDecoratorsRemoved(
          DecoratorCategoryEnum.RouterDecorators,
          this.decoratorsFilterService.getActiveRouterDecorators()
        );
      },
      () =>
        this.decoratorEventService.triggerNodeDecoratorsLoaded(
          DecoratorCategoryEnum.RouterDecorators,
          decoratorTypes,
          nodeDecorators
        )
    );
  }

  /**
   * Flattens results from multiple server requests and triggers events to notify visual components about changes
   * @param {Observable<NodeDecorator[]>[]} nodeObservables array of all observables of node decorators from server requests
   * @param {HostNodeDecoratorTypeEnum[]} decoratorTypes array of reloaded decorator types
   */
  private passHostNodeDecoratorsToGraph(
    nodeObservables: Observable<NodeDecorator[]>[],
    decoratorTypes: HostNodeDecoratorTypeEnum[]
  ) {
    const nodeDecorators: NodeDecorator[] = [];

    // testData
    /*        nodeDecorators.push(new NodeLogicalRoleDecorator(4, NodeLogicalRoleEnum.Attacker));
        nodeDecorators.push(new NodeSemaphoreDecorator(4, NodeSemaphoreDecoratorStatusEnum.Orange));
        nodeDecorators.push(new NodeStatusDecorator(4, StatusEnum.Online));*/

    // forkJoin processes multiple observables and flattens the result to node and link arrays.
    // When flattening is completed event is triggered
    forkJoin(nodeObservables).subscribe(
      (responses) =>
        responses.forEach((decorators) => {
          decorators.forEach((dec) => nodeDecorators.push(dec));
        }),
      (err) => {
        this.triggerDecoratorLoadError();
        this.decoratorStateService.setActive(false);
        this.decoratorEventService.triggerNodeDecoratorsRemoved(
          DecoratorCategoryEnum.HostDecorators,
          this.decoratorsFilterService.getActiveHostDecorators()
        );
      },
      () =>
        this.decoratorEventService.triggerNodeDecoratorsLoaded(
          DecoratorCategoryEnum.HostDecorators,
          decoratorTypes,
          nodeDecorators
        )
    );
  }

  /**
   * Flattens results from multiple server requests and triggers events to notify visual components about changes
   * @param {Observable<LinkDecorator[]>[]} linkObservables array of all observable of link decorators from server requests
   * @param {LinkDecoratorTypeEnum[]} decoratorTypes array of reloaded decorator types
   */
  private passLinkDecoratorsToGraph(
    linkObservables: Observable<LinkDecorator[]>[],
    decoratorTypes: LinkDecoratorTypeEnum[]
  ) {
    const linkDecorators: LinkDecorator[] = [];

    // testData
    /*    linkDecorators.push(new LinkMailDecorator(25, 100));
    linkDecorators.push(new LinkMailDecorator(24, 1000000));*/

    forkJoin(linkObservables).subscribe(
      (responses) => responses.forEach((decorators) => decorators.forEach((dec) => linkDecorators.push(dec))),
      (err) => {
        this.triggerDecoratorLoadError();
        this.decoratorStateService.setActive(false);
        this.decoratorEventService.triggerLinkDecoratorsRemoved(
          DecoratorCategoryEnum.LinkDecorators,
          this.decoratorsFilterService.getActiveLinkDecorators()
        );
      },
      () => {
        this.decoratorEventService.triggerLinkDecoratorsLoaded(
          DecoratorCategoryEnum.LinkDecorators,
          decoratorTypes,
          linkDecorators
        );
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
