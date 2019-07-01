import {LinkDecorator} from '../decorators/link-decorator';
import {LinkDecoratorTypeEnum} from '../enums/link-decorator-type-enum';
import {DecoratorEventMessageEnum} from '../enums/decorator-event-message-enum';
import {DecoratorCategoryEnum} from '../enums/decorator-category-enum';

/**
 * Event describing change in node decorators.
 * Message is to describe what is the cause of this event
 * Category is category of network part on which decorators changed (link, host node, router node)
 * DecoratorTypes is an array of decorator types affected by the change
 * Payload is an array of actual decorator objects to be assigned
 */
export class LinkDecoratorChangeEvent {
  message: DecoratorEventMessageEnum;
  decoratorCategory: DecoratorCategoryEnum;
  decoratorTypes: LinkDecoratorTypeEnum[];
  payload?: LinkDecorator[];


  constructor(message: DecoratorEventMessageEnum,
              decoratorCategory: DecoratorCategoryEnum,
              decoratorType: LinkDecoratorTypeEnum[],
              payload?: LinkDecorator[]) {
    this.message = message;
    this.decoratorCategory = decoratorCategory;
    this.decoratorTypes = decoratorType;
    this.payload = payload;
  }
}
