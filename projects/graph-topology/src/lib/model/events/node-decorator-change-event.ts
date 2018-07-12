import {NodeDecorator} from '../decorators/node-decorator';
import {HostNodeDecoratorTypeEnum} from '../enums/host-node-decorator-type-enum';
import {RouterNodeDecoratorTypeEnum} from '../enums/router-node-decorator-type-enum';
import {DecoratorEventMessageEnum} from '../enums/decorator-event-message-enum';
import {DecoratorCategoryEnum} from '../enums/decorator-category-enum';

/**
 * Event describing change in node decorators.
 * Message is to describe what is the cause of this event
 * Category is category of network part on which decorators changed (link, host node, router node)
 * DecoratorTypes is an array of decorator types affected by the change
 * Payload is an array of actual decorator objects to be assigned
 */
export class NodeDecoratorChangeEvent {
  message: DecoratorEventMessageEnum;
  category: DecoratorCategoryEnum;
  decoratorTypes: HostNodeDecoratorTypeEnum[] | RouterNodeDecoratorTypeEnum[];
  payload?: NodeDecorator[];


  constructor(message: DecoratorEventMessageEnum,
              category: DecoratorCategoryEnum,
              decoratorTypes: HostNodeDecoratorTypeEnum[] | RouterNodeDecoratorTypeEnum[],
              payload?: NodeDecorator[]) {
    this.message = message;
    this.category = category;
    this.decoratorTypes = decoratorTypes;
    this.payload = payload;
  }
}

