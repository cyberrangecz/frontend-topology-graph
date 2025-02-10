import { Injectable } from '@angular/core';
import { LinkDecorator } from '../model/decorators/link-decorator';
import { NodeDecorator } from '../model/decorators/node-decorator';
import { LinkDecoratorChangeEvent } from '../model/events/link-decorator-change-event';
import { NodeDecoratorChangeEvent } from '../model/events/node-decorator-change-event';

import { Observable, Subject } from 'rxjs';
import { HostNodeDecoratorTypeEnum } from '../model/enums/host-node-decorator-type-enum';
import { RouterNodeDecoratorTypeEnum } from '../model/enums/router-node-decorator-type-enum';
import { LinkDecoratorTypeEnum } from '../model/enums/link-decorator-type-enum';
import { DecoratorEventMessageEnum } from '../model/enums/decorator-event-message-enum';
import { DecoratorCategoryEnum } from '../model/enums/decorator-category-enum';
import { DecoratorReloadRequestEvent } from '../model/events/decorator-reload-request-event';

/**
 * Service used to send events to visual components of the graph-visual to notify them and pass newly loaded decorators
 */
@Injectable()
export class DecoratorEventService {
  private onNodeDecoratorsChangeSubject: Subject<NodeDecoratorChangeEvent> = new Subject();
  onNodeDecoratorsChange: Observable<NodeDecoratorChangeEvent> = this.onNodeDecoratorsChangeSubject.asObservable();

  private onLinkDecoratorsChangeSubject: Subject<LinkDecoratorChangeEvent> = new Subject();
  onLinkDecoratorsChange: Observable<LinkDecoratorChangeEvent> = this.onLinkDecoratorsChangeSubject.asObservable();

  private onDecoratorReloadRequestSubject: Subject<DecoratorReloadRequestEvent> = new Subject();
  onDecoratorReloadRequest: Observable<DecoratorReloadRequestEvent> =
    this.onDecoratorReloadRequestSubject.asObservable();

  /**
   * Creates event with newly loaded link decorators.
   * @param {DecoratorCategoryEnum} decoratorCategory category of parts of a graph affected by the change (links in this case)
   * @param {LinkDecoratorTypeEnum[]} decoratorTypes array of loaded decorator types
   * @param {LinkDecorator[]} linkDecorators array of loaded link decorator objects
   */
  public triggerLinkDecoratorsLoaded(
    decoratorCategory: DecoratorCategoryEnum,
    decoratorTypes: LinkDecoratorTypeEnum[],
    linkDecorators: LinkDecorator[],
  ) {
    this.onLinkDecoratorsChangeSubject.next(
      new LinkDecoratorChangeEvent(
        DecoratorEventMessageEnum.DecoratorsLoaded,
        decoratorCategory,
        decoratorTypes,
        linkDecorators,
      ),
    );
  }

  /**
   * Creates event with newly loaded node decorators.
   * @param {DecoratorCategoryEnum} decoratorCategory decoratorCategory category of parts of a graph affected
   * by the change (router node or host nodes in this case)
   * @param {HostNodeDecoratorTypeEnum[] | RouterNodeDecoratorTypeEnum[]} decoratorTypes decoratorTypes array of loaded decorator types
   * @param {NodeDecorator[]} nodeDecorators linkDecorators array of loaded node decorator objects
   */
  public triggerNodeDecoratorsLoaded(
    decoratorCategory: DecoratorCategoryEnum,
    decoratorTypes: HostNodeDecoratorTypeEnum[] | RouterNodeDecoratorTypeEnum[],
    nodeDecorators: NodeDecorator[],
  ) {
    this.onNodeDecoratorsChangeSubject.next(
      new NodeDecoratorChangeEvent(
        DecoratorEventMessageEnum.DecoratorsLoaded,
        decoratorCategory,
        decoratorTypes,
        nodeDecorators,
      ),
    );
  }

  /**
     * Sends event with node decorator types which should be removed

     * @param decoratorCategory decorator category which types should be removed
     * @param {HostNodeDecoratorTypeEnum[] | RouterNodeDecoratorTypeEnum[]} decoratorTypes array of decorator types to remove
     */
  public triggerNodeDecoratorsRemoved(
    decoratorCategory: DecoratorCategoryEnum,
    decoratorTypes: HostNodeDecoratorTypeEnum[] | RouterNodeDecoratorTypeEnum[],
  ) {
    this.onNodeDecoratorsChangeSubject.next(
      new NodeDecoratorChangeEvent(DecoratorEventMessageEnum.DecoratorsDeleted, decoratorCategory, decoratorTypes),
    );
  }

  /**
   * @param decoratorCategory decorator category which types should be removed
   * Sends event with link decorator types which should be removed
   * @param {LinkDecoratorTypeEnum[]} decoratorTypes array of decorator types to remove
   */
  public triggerLinkDecoratorsRemoved(
    decoratorCategory: DecoratorCategoryEnum,
    decoratorTypes: LinkDecoratorTypeEnum[],
  ) {
    this.onLinkDecoratorsChangeSubject.next(
      new LinkDecoratorChangeEvent(DecoratorEventMessageEnum.DecoratorsDeleted, decoratorCategory, decoratorTypes),
    );
  }

  /**
   * Sends event to components responsible for reloading decorators with request to reload certain type of decorators.
   * If one of parameter is null (ids or decorator types). Request is applied globally.
   * This means:
   *  a) Ids is null, type is not null -> decorators of specified types are reloaded for all nodes / links
   *  b) Ids is not null, type is null -> decorators of all types are reloaded for specified nodes / links
   *  c) Ids is null, type is null -> decorators of all types are reloaded for all nodes / links
   *  Category type parameter CANNOT BE NULL.
   * @param {DecoratorCategoryEnum} categoryType category of element and its decorator - ROUTER, HOST or LINK. Cannot be null
   * @param {HostNodeDecoratorTypeEnum | RouterNodeDecoratorTypeEnum | LinkDecoratorTypeEnum} decoratorType
   * decorator type which should be reloaded. If is null, all types are reloaded
   * @param {string[]} names array of names of topology elements whose decorators should be reloaded.
   * Can be omitted - null is passed  as default value- applies to all elements
   */
  public triggerDecoratorReloadRequest(
    categoryType: DecoratorCategoryEnum,
    decoratorType: HostNodeDecoratorTypeEnum | RouterNodeDecoratorTypeEnum | LinkDecoratorTypeEnum,
    names: string[] = null,
  ) {
    this.onDecoratorReloadRequestSubject.next(new DecoratorReloadRequestEvent(categoryType, decoratorType, names));
  }
}
