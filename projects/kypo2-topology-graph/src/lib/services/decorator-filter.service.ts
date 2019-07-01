import {Injectable} from '@angular/core';
import {RouterNodeDecoratorTypeEnum} from '../model/enums/router-node-decorator-type-enum';
import {HostNodeDecoratorTypeEnum} from '../model/enums/host-node-decorator-type-enum';
import {LinkDecoratorTypeEnum} from '../model/enums/link-decorator-type-enum';
import {DecoratorCategoryEnum} from '../model/enums/decorator-category-enum';
import {DecoratorEventService} from './decorator-event.service';

/**
 * Service for filtering out decorator types visible in application.
 * By default all possible decorator types are visible.
 */
@Injectable()
export class DecoratorFilterService  {
  private _routerDecorators: RouterNodeDecoratorTypeEnum[];
  private _hostDecorators: HostNodeDecoratorTypeEnum[];
  private _linkDecorators: LinkDecoratorTypeEnum[];

  constructor(private decoratorEventService: DecoratorEventService) {
    this._routerDecorators = Object.values(RouterNodeDecoratorTypeEnum);
    this._hostDecorators = Object.values(HostNodeDecoratorTypeEnum);
    this._linkDecorators = Object.values(LinkDecoratorTypeEnum);
  }

  /**
   * @returns {RouterNodeDecoratorTypeEnum[]}  array of every visible router decorator type
   */
  getActiveRouterDecorators(): RouterNodeDecoratorTypeEnum[] {
    return this._routerDecorators.slice(0);
  }

  /**
   *
   * @returns {LinkDecoratorTypeEnum[]} array of every visible link decorator type
   */
  getActiveLinkDecorators(): LinkDecoratorTypeEnum[] {
    return this._linkDecorators.slice(0);
  }

  /**
   *
   * @returns {HostNodeDecoratorTypeEnum[]} array of every visible host decorator type
   */
  getActiveHostDecorators(): HostNodeDecoratorTypeEnum[] {
    return this._hostDecorators.slice(0);
  }

  /**
   * Removes all decorator types of certain category from visible decorators
   * @param {DecoratorCategoryEnum} decoratorCategory category which decorators should be removed
   */
  removeAll(decoratorCategory: DecoratorCategoryEnum) {
    switch (decoratorCategory) {
      case DecoratorCategoryEnum.RouterDecorators: {
        this.removeAllRouterDecorators();
        break;
      }
      case DecoratorCategoryEnum.HostDecorators: {
        this.removeAllHostDecorators();
        break;
      }
      case DecoratorCategoryEnum.LinkDecorators: {
        this.removeAllLinkDecorators();
        break;
      }
      default:
        break;
    }
  }

  /**
   * Adds all decorator types of certain category to visible decorators
   * @param {DecoratorCategoryEnum} decoratorCategory
   */
  addAll(decoratorCategory: DecoratorCategoryEnum) {
    switch (decoratorCategory) {
      case DecoratorCategoryEnum.RouterDecorators: {
        this.addAllRouterDecorators();
        break;
      }
      case DecoratorCategoryEnum.HostDecorators: {
        this.addAllHostDecorators();
        break;
      }
      case DecoratorCategoryEnum.LinkDecorators: {
        this.addAllLinkDecorators();
        break;
      }
      default:
        break;
    }
  }

  /**
   * Adds one type of certain category to visible decorators
   * @param {DecoratorCategoryEnum} category of decorator type
   * @param toAdd decorator type to add to visible decorators
   */
  add(category: DecoratorCategoryEnum, toAdd) {
    switch (category) {
      case DecoratorCategoryEnum.RouterDecorators: {
        this.addRouterDecorator(toAdd);
        break;
      }
      case DecoratorCategoryEnum.HostDecorators: {
        this.addHostDecorator(toAdd);
        break;
      }
      case DecoratorCategoryEnum.LinkDecorators: {
        this.addLinkDecorator(toAdd);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Removes one type of certain category from visible decorators
   * @param {DecoratorCategoryEnum} category of decorator type
   * @param toRemove decorator type to remove from visible decorators
   */
  remove(category: DecoratorCategoryEnum, toRemove) {
    switch (category) {
      case DecoratorCategoryEnum.RouterDecorators: {
        this.removeRouterDecorator(toRemove);
        break;
      }
      case DecoratorCategoryEnum.HostDecorators: {
        this.removeHostDecorator(toRemove);
        break;
      }
      case DecoratorCategoryEnum.LinkDecorators: {
        this.removeLinkDecorator(toRemove);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Removes router decorator type from visible decorators and triggers event to refresh visual components
   * @param {RouterNodeDecoratorTypeEnum} toRemove router decorator type which should be removed from visible decorators
   */
  private removeRouterDecorator(toRemove: RouterNodeDecoratorTypeEnum) {
    this._routerDecorators = this._routerDecorators
      .filter(d => d !== toRemove);
    this.decoratorEventService.triggerNodeDecoratorsRemoved(DecoratorCategoryEnum.RouterDecorators, [toRemove]);
  }

  /**
   * removes all router decorator types from visible decorators and triggers event to refresh visual components
   */
  private removeAllRouterDecorators() {
    this._routerDecorators = [];
    this.decoratorEventService
      .triggerNodeDecoratorsRemoved(DecoratorCategoryEnum.RouterDecorators, Object.values(RouterNodeDecoratorTypeEnum));

  }

  /**
   * Adds router decorator type to visible decorators and triggers reload event to refresh loaded decorators
   * @param {RouterNodeDecoratorTypeEnum} toAdd router decorator type which should be added to visible decorators
   */
  private addRouterDecorator(toAdd: RouterNodeDecoratorTypeEnum) {
    if (toAdd !== null && !this._routerDecorators.includes(toAdd)) {
      this._routerDecorators.push(toAdd);
      this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.RouterDecorators, toAdd);
    }
  }

  /**
   * Adds all router decorators to visible decorators and triggers reload events to refresh loaded decorators
   */
  private addAllRouterDecorators() {
    this._routerDecorators = Object.values(RouterNodeDecoratorTypeEnum);
    this._routerDecorators.forEach(
      decType => {
      this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.RouterDecorators, decType);
    });
  }

  /**
   * Removes host node decorator type from visible decorators and triggers event to refresh visual components
   * @param {HostNodeDecoratorTypeEnum} toRemove host node decorator type which should be removed from visible decorators
   */
  private removeHostDecorator(toRemove: HostNodeDecoratorTypeEnum) {
    this._hostDecorators = this._hostDecorators
      .filter(d => d !== toRemove);
    this.decoratorEventService.triggerNodeDecoratorsRemoved(DecoratorCategoryEnum.HostDecorators, [toRemove]);

  }

  /**
   * Removes all host node decorator types from visible decorators and triggers event to refresh visual components
   */
  private removeAllHostDecorators() {
    this._hostDecorators = [];
    this.decoratorEventService.triggerNodeDecoratorsRemoved(DecoratorCategoryEnum.HostDecorators, Object.values(HostNodeDecoratorTypeEnum));
  }

  /**
   * Adds host node decorator type to visible decorators and triggers reload event to refresh loaded decorators
   * @param {HostNodeDecoratorTypeEnum} toAdd host node decorator type which should be added to visible decorators
   */
  private addHostDecorator(toAdd: HostNodeDecoratorTypeEnum) {
    if (toAdd !== null && !this._hostDecorators.includes(toAdd)) {
      this._hostDecorators.push(toAdd);
      this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.HostDecorators, toAdd);

    }
  }

  /**
   * Adds all host node decorator types to visible decorators and triggers reload events to refresh loaded decorators
   */
  private addAllHostDecorators() {
    this._hostDecorators = Object.values(HostNodeDecoratorTypeEnum);
    this._hostDecorators.forEach(
      decType => {
        this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.HostDecorators, decType);
      });
  }

  /**
   * Removes link decorator type from visible decorators and triggers event to refresh visual components
   * @param {LinkDecoratorTypeEnum} toRemove link decorator type which should be removed from visible decorators
   */
  private removeLinkDecorator(toRemove: LinkDecoratorTypeEnum) {
    this._linkDecorators = this._linkDecorators
      .filter(d => d !== toRemove);
    this.decoratorEventService.triggerLinkDecoratorsRemoved(DecoratorCategoryEnum.LinkDecorators,  [toRemove]);

  }

  /**
   * Removes all link decorator types from visible decorators and triggers event to refresh visual components
   */
  private removeAllLinkDecorators() {
    this._linkDecorators = [];
    this.decoratorEventService.triggerLinkDecoratorsRemoved(DecoratorCategoryEnum.LinkDecorators, Object.values(LinkDecoratorTypeEnum));
  }

  /**
   * Adds link decorator type to visible decorators and triggers reload event to refresh loaded decorators
   * @param {LinkDecoratorTypeEnum} toAdd link decorator type which should be added to visible decorators
   */
  private addLinkDecorator(toAdd: LinkDecoratorTypeEnum) {
    if (toAdd !== null && !this._linkDecorators.includes(toAdd)) {
      this._linkDecorators.push(toAdd);
      this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.LinkDecorators, toAdd);

    }
  }

  /**
   * Adds all link decorator types to visible decorators and triggers reload events to refresh loaded decorators
   */
  private addAllLinkDecorators() {
    this._linkDecorators = Object.values(LinkDecoratorTypeEnum);
    this._linkDecorators.forEach(
      decType => {
        this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.LinkDecorators, decType);
      }
    );
  }
}
