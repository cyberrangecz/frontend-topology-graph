import {DecoratorCheckboxModel} from './decorator-checkbox-model';
import {DecoratorCategoryEnum} from '../../../model/enums/decorator-category-enum';

/**
 * Model of category checkbox with children decorator checkboxes.
 */
export class CategoryCheckboxModel {
  categoryType: DecoratorCategoryEnum;
  checked: boolean;
  disabled: boolean;
  decoratorCheckboxes: DecoratorCheckboxModel[];


  constructor(categoryType: DecoratorCategoryEnum, checked: boolean, decoratorCheckboxes: DecoratorCheckboxModel[]) {
    this.categoryType = categoryType;
    this.checked = checked;
    this.disabled = false;
    this.decoratorCheckboxes = decoratorCheckboxes;
  }

  /**
   * Change own state and state of all children checkboxes
   */
  onChange() {
    this.checked = !this.checked;
    this.decoratorCheckboxes
      .forEach(checkbox => checkbox.checked = this.checked);
  }

  /**
   * Decides if its state corresponds with children states
   */
  decideState() {
    this.checked = this.decoratorCheckboxes.every(sub => sub.checked);
  }
}
