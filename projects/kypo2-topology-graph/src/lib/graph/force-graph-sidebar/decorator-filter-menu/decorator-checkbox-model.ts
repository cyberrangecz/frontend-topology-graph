import {LinkDecoratorTypeEnum} from '../../../model/enums/link-decorator-type-enum';
import {RouterNodeDecoratorTypeEnum} from '../../../model/enums/router-node-decorator-type-enum';
import {HostNodeDecoratorTypeEnum} from '../../../model/enums/host-node-decorator-type-enum';

/**
 * Model fo decorator checkbox
 */
export class DecoratorCheckboxModel {
  decoratorType: RouterNodeDecoratorTypeEnum | HostNodeDecoratorTypeEnum | LinkDecoratorTypeEnum;
  checked: boolean;
  disabled: boolean;

  constructor(decoratorType: RouterNodeDecoratorTypeEnum | HostNodeDecoratorTypeEnum | LinkDecoratorTypeEnum, checked: boolean) {
    this.decoratorType = decoratorType;
    this.checked = checked;
    this.disabled = false;
  }

  onChange() {
    this.checked = !this.checked;
  }
}
