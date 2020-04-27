import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Link } from 'kypo2-topology-graph-model';
import { LinkSpeedDecorator } from '../../model/decorators/link-speed-decorator';
import {DecoratorEventService} from '../../services/decorator-event.service';
import {LinkMailDecorator} from '../../model/decorators/link-mail-decorator';
import {LinkDecorator} from '../../model/decorators/link-decorator';
import {LinkDecoratorTypeEnum} from '../../model/enums/link-decorator-type-enum';
import {DecoratorEventMessageEnum} from '../../model/enums/decorator-event-message-enum';
import {LinkDecoratorSpeedEnum} from '../../model/enums/link-decorator-speed-enum';
import {DecoratorCategoryEnum} from '../../model/enums/decorator-category-enum';
import {ICONS_PATH} from '../../icons-path';
/**
 * Visual component used to display links in the graph-visual and its decorators. Binds to link mode.
 */
@Component({
  selector: '[linkVisual]',
  templateUrl: './graph-link-visual.component.html',
  styleUrls: ['./graph-link-visual.component.css']
})
export class GraphLinkVisualComponent implements OnInit, OnDestroy {

  @Input('linkVisual') link: Link;

  iconsPath = ICONS_PATH;
  speedDecorator: LinkSpeedDecorator;
  mailDecorator: LinkMailDecorator;

  linkDecoratorSpeed: LinkDecoratorSpeedEnum;
  linkDecoratorMailSpeed: LinkDecoratorSpeedEnum;

  private _decoratorEventSubscription;

  /**
   * Subscribes to decorator event service
   * @param {DecoratorEventService} decoratorEventService
   */
  constructor(private decoratorEventService: DecoratorEventService) {
  }


  ngOnInit() {
    this.subscribeDecoratorChange();
    // this.setSpeedDecoratorWayClass();
  }

  /**
   * Calculates decorator animation speed (duration) from SpeedEnum.
   * @param {LinkDecoratorSpeedEnum} speedEnum enum describing speed of decorator
   * @returns {number} calculated duration of animation
   */
  calculateDecoratorAnimationDuration(speedEnum: LinkDecoratorSpeedEnum) {
    switch (speedEnum) {
      case LinkDecoratorSpeedEnum.Fast:
        return 750;
      case LinkDecoratorSpeedEnum.Medium:
        return 2000;
      case LinkDecoratorSpeedEnum.Slow:
        return 3000;
    }
  }

  /**
   * Subscribes to decorator change event
   */
  private subscribeDecoratorChange() {
    this._decoratorEventSubscription = this.decoratorEventService.onLinkDecoratorsChange
      .subscribe({
          next: event => {
            if (event.message === DecoratorEventMessageEnum.DecoratorsLoaded) {
              this.onDecoratorChange(event.decoratorCategory, event.decoratorTypes, event.payload);
            } else if (event.message === DecoratorEventMessageEnum.DecoratorsDeleted) {
              this.onDecoratorRemove(event.decoratorTypes);
            }
          }
        }
      );
  }

  /**
   * Sets class of speed decorator line to distinguish two way stream of data visually
   */
/*  private setSpeedDecoratorWayClass() {
    if (this.link.source.id > this.link.target.id) {
      this.way = 'up';
    } else {
      this.way = 'down';
    }
  }*/

  /**
   * Refreshes all decorators if change was triggered by DecoratorEventService
   */
  private onDecoratorChange(category: DecoratorCategoryEnum, decoratorTypes: LinkDecoratorTypeEnum[], linkDecorators: LinkDecorator[]) {
    // extract decorators for this link
    const decorators = linkDecorators.filter(d => d.linkName === this.link.id.toString());

    if (category === DecoratorCategoryEnum.LinkDecorators) {
      this.addActiveDecorators(decorators);
      this.removeNonActiveDecorators(decoratorTypes, decorators);
    }


  }

  /**
   * Adds all decorators received in latest event
   * @param {LinkDecorator[]} activeDecorators decorators present in latest received event
   */
  private addActiveDecorators(activeDecorators: LinkDecorator[]) {
    for (const decorator of activeDecorators) {
      if (decorator instanceof LinkSpeedDecorator && decorator.speed > 0) {
        this.speedDecorator = decorator;
        this.linkDecoratorSpeed = this.resolveLinkSpeed(this.speedDecorator.speed);
      }
      if (decorator instanceof LinkMailDecorator && decorator.amount > 0) {
        this.mailDecorator = decorator;
        this.linkDecoratorMailSpeed = this.resolveMailSpeed(this.mailDecorator.amount);
      }
    }
  }

  /**
   * Removes all old decorators (decorators not present in latest received event).
   * Compares received decorator objects with decorator types which was reloaded
   * to avoid removing decorators which was not part of the reload.
   * @param {LinkDecoratorTypeEnum[]} decoratorTypes decorator types present in latest
   * received event (which decorator types should not be removed
   * @param {LinkDecorator[]} activeDecorators decorators present in latest received event (which decorators should not be removed)
   */
  private removeNonActiveDecorators(decoratorTypes: LinkDecoratorTypeEnum[], activeDecorators: LinkDecorator[]) {
    if (decoratorTypes.includes(LinkDecoratorTypeEnum.LinkSpeedDecorator)
      && !activeDecorators.find(dec => dec instanceof LinkSpeedDecorator)) {
      this.speedDecorator = null;
    }
    if (decoratorTypes.includes(LinkDecoratorTypeEnum.LinkSpeedDecorator)
      && !activeDecorators.find(dec => dec instanceof LinkMailDecorator)) {
      this.mailDecorator = null;
    }
  }

  /**
   * Removes all decorator types if change was triggered by DecoratorEventService
   * @param {LinkDecoratorTypeEnum[]} decoratorTypes list of decorator types to be removes
   */
  private onDecoratorRemove(decoratorTypes: LinkDecoratorTypeEnum[]) {
    decoratorTypes.forEach(decoratorType => {
      switch (decoratorType) {
        case LinkDecoratorTypeEnum.LinkMailDecorator: {
          this.mailDecorator = null;
          break;
        }
        case LinkDecoratorTypeEnum.LinkSpeedDecorator: {
          this.speedDecorator = null;
          break;
        }
        default:
          break;
      }
    });
  }

  /**
   * Maps speed of a link (transferred data) to enum.
   * @param {number} speed of a link
   * @returns {LinkDecoratorSpeedEnum} enum which matches the speed
   */
  private resolveLinkSpeed(speed: number): LinkDecoratorSpeedEnum {
    if (speed > 0 && speed <= 10000 ) {
      return LinkDecoratorSpeedEnum.Slow;
    } else if (speed > 10000 && speed <= 100000) {
      return LinkDecoratorSpeedEnum.Medium;
    } else if (speed > 100000) {
      return LinkDecoratorSpeedEnum.Fast;
    }
  }

  /**
   * Map amount of messages transferred between two nodes to enum
   * @param {number} amount of transferred messages
   * @returns {LinkDecoratorSpeedEnum} enum which matches the speed
   */
  private resolveMailSpeed(amount: number): LinkDecoratorSpeedEnum {
    if (amount > 0 && amount <= 10000 ) {
      return LinkDecoratorSpeedEnum.Slow;
    } else if (amount > 10000 && amount <= 100000) {
      return LinkDecoratorSpeedEnum.Medium;
    } else if (amount > 100000) {
      return LinkDecoratorSpeedEnum.Fast;
    }
  }


  ngOnDestroy(): void {
    if (this._decoratorEventSubscription) {
      this._decoratorEventSubscription.unsubscribe();
    }
  }
}
