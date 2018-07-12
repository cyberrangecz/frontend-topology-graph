import {DecoratorCategoryEnum} from '../enums/decorator-category-enum';
import {HostNodeDecoratorTypeEnum} from '../enums/host-node-decorator-type-enum';
import {RouterNodeDecoratorTypeEnum} from '../enums/router-node-decorator-type-enum';
import {LinkDecoratorTypeEnum} from '../enums/link-decorator-type-enum';

/**
 * Event used in decorator event service. Used when lower (in hierarchy) component requests reload of decorators.
 * DecoratorCategory decides which nodes will be affected by reload and decoratorTypes decides which decorator type will be reloaded
 */
export class DecoratorReloadRequestEvent {
  decoratorCategory: DecoratorCategoryEnum;
  decoratorType: HostNodeDecoratorTypeEnum | RouterNodeDecoratorTypeEnum | LinkDecoratorTypeEnum;
  ids: number[];


  constructor(decoratorCategory: DecoratorCategoryEnum,
              decoratorType: HostNodeDecoratorTypeEnum | RouterNodeDecoratorTypeEnum | LinkDecoratorTypeEnum,
              ids: number[] = null) {
    this.ids = ids;
    this.decoratorCategory = decoratorCategory;
    this.decoratorType = decoratorType;
  }
}
