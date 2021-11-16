import { Component, Input, OnDestroy } from '@angular/core';
import { DecoratorFilterService } from '../../../services/decorator-filter.service';
import { DecoratorCategoryEnum } from '../../../model/enums/decorator-category-enum';
import { CategoryCheckboxModel } from './category-checkbox-model';
import { DecoratorCheckboxModel } from './decorator-checkbox-model';
import { RouterNodeDecoratorTypeEnum } from '../../../model/enums/router-node-decorator-type-enum';
import { HostNodeDecoratorTypeEnum } from '../../../model/enums/host-node-decorator-type-enum';
import { LinkDecoratorTypeEnum } from '../../../model/enums/link-decorator-type-enum';
import { DecoratorStateService } from '../../../services/decorator-state.service';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions } from '@angular/material/checkbox';

/**
 * Component of decorator filter menu. Handles checking and unchecking visible decorators
 * with appropriate actions. Filter menu is generated based on possible categories of decorators
 * and decorator types for each category. If any more decorators are added or removed in the future
 * this component should not need any additional changes as long as changes are made in CategoryEnum and
 * DecoratorTypeEnum.
 */
@Component({
  selector: 'app-decorator-filter-menu',
  templateUrl: './decorator-filter-menu.component.html',
  styleUrls: ['./decorator-filter-menu.component.css'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions },
  ],
})
export class DecoratorFilterMenuComponent implements OnDestroy {
  categoryCheckboxes: CategoryCheckboxModel[];

  showDecoratorsFilterMenu;
  indeterminate = false;

  private _stateSubscription;
  /**
   * Creates category checkbox objects and its subcategories based on category enums and decorator enums for each category
   * @param {DecoratorFilterService} decoratorFilterService injected filter service
   */
  constructor(
    private decoratorFilterService: DecoratorFilterService,
    private decoratorStateService: DecoratorStateService
  ) {
    this.showDecoratorsFilterMenu = this.decoratorStateService.getActive();
    this.subscribeStateChanges();
    this.createCategoryCheckboxes();
    this.createTypeCheckboxes();
  }

  /**
   * Turns on/off all checkboxes
   */
  toggleDecoratorsFilterMenu() {
    this.showDecoratorsFilterMenu = !this.showDecoratorsFilterMenu;
    this.decoratorStateService.setActive(this.showDecoratorsFilterMenu);
    if (this.showDecoratorsFilterMenu) {
      this.turnOnAllCheckboxes();
    } else {
      this.turnOffAllCheckboxes();
    }
  }

  /**
   * Turns off all checkboxes
   */
  private turnOffAllCheckboxes() {
    this.categoryCheckboxes.forEach((category) => {
      category.disabled = true;
      this.categoryFilteringChange(category);

      category.decoratorCheckboxes.forEach((decoratorType) => {
        decoratorType.disabled = true;
        this.decoratorFilteringChange(category, decoratorType);
      });
    });
  }

  /**
   * Turns on all checkboxes
   */
  private turnOnAllCheckboxes() {
    this.categoryCheckboxes.forEach((category) => {
      category.disabled = false;
      this.categoryFilteringChange(category);

      category.decoratorCheckboxes.forEach((decoratorType) => {
        decoratorType.disabled = false;
        this.decoratorFilteringChange(category, decoratorType);
      });
    });
  }

  /**
   * Toggles category checkboxes and checks the state of the filter service
   * @param {CategoryCheckboxModel} categoryCheckbox checkbox to toggle
   */
  toggleAndCheckCategoryCheckbox(categoryCheckbox: CategoryCheckboxModel) {
    if (!categoryCheckbox.disabled) {
      this.toggleCategoryCheckbox(categoryCheckbox);
      this.categoryFilteringChange(categoryCheckbox);
    }
  }

  /**
   *  Toggles a decorator checkbox and checks the state of the filter services
   * @param {CategoryCheckboxModel} categoryCheckbox a category which is the decorator checkbox a part of
   * @param {DecoratorCheckboxModel} decoratorCheckbox a decorator checkbox which should be toggled
   */
  toggleAndCheckDecoratorCheckbox(categoryCheckbox: CategoryCheckboxModel, decoratorCheckbox: DecoratorCheckboxModel) {
    if (!categoryCheckbox.disabled || !decoratorCheckbox.disabled) {
      this.toggleDecoratorCheckbox(categoryCheckbox, decoratorCheckbox);
      this.decoratorFilteringChange(categoryCheckbox, decoratorCheckbox);
    }
  }

  /**
   * Toggles a category checkbox
   * @param {CategoryCheckboxModel} categoryCheckbox checkbox to toggle
   */
  private toggleCategoryCheckbox(categoryCheckbox: CategoryCheckboxModel) {
    categoryCheckbox.onChange();
  }

  /**
   * Toggles a decorator checkbox
   * @param {CategoryCheckboxModel} categoryCheckbox a category which is the decorator checkbox a part of
   * @param {DecoratorCheckboxModel} decoratorCheckbox a decorator checkbox which should be toggled
   */
  private toggleDecoratorCheckbox(categoryCheckbox: CategoryCheckboxModel, decoratorCheckbox: DecoratorCheckboxModel) {
    decoratorCheckbox.onChange();
    categoryCheckbox.decideState();
  }

  /**
   * Calls method of category checkbox to change its state and calls filter service to add or remove category from active
   * @param categoryCheckbox changed checkbox
   */
  private categoryFilteringChange(categoryCheckbox: CategoryCheckboxModel) {
    if (categoryCheckbox.checked && !categoryCheckbox.disabled) {
      this.decoratorFilterService.addAll(categoryCheckbox.categoryType);
    } else {
      this.decoratorFilterService.removeAll(categoryCheckbox.categoryType);
    }
  }

  /**
   * Call method of decorator checkbox to change its state and call filter service to add or remove decorator type form active.
   * Then calls category checkbox (parent) to decide whether its state should not be changed too.
   * @param categoryCheckbox parent checkbox
   * @param decoratorCheckbox changed checkbox
   */
  private decoratorFilteringChange(categoryCheckbox: CategoryCheckboxModel, decoratorCheckbox: DecoratorCheckboxModel) {
    if (decoratorCheckbox.checked && !decoratorCheckbox.disabled && !categoryCheckbox.disabled) {
      this.decoratorFilterService.add(categoryCheckbox.categoryType, decoratorCheckbox.decoratorType);
    } else {
      this.decoratorFilterService.remove(categoryCheckbox.categoryType, decoratorCheckbox.decoratorType);
    }
  }

  /**
   * creates category checkboxes from values of DecoratorCategoryEnum
   */
  private createCategoryCheckboxes() {
    this.categoryCheckboxes = [];
    Object.values(DecoratorCategoryEnum).forEach((category) =>
      this.categoryCheckboxes.push(new CategoryCheckboxModel(category, true, []))
    );
  }

  /**
   * Creates checkboxes for every type of each category and decides state of category checkboxes
   */
  private createTypeCheckboxes() {
    this.createRouterTypeCheckboxes();
    this.createHostTypeCheckboxes();
    this.createLinkTypeCheckboxes();
    this.categoryCheckboxes.forEach((c) => c.decideState());
  }

  /**
   * Creates decorators of router category checkboxes from RouterNodeDecoratorTypeEnum, adds itself to appropriate category
   * and decides if it should be checked or unchecked based on active router decorators retrieved from filter service
   */
  private createRouterTypeCheckboxes() {
    Object.values(RouterNodeDecoratorTypeEnum).forEach((dType) =>
      this.categoryCheckboxes
        .find((c) => c.categoryType === DecoratorCategoryEnum.RouterDecorators)
        .decoratorCheckboxes.push(
          new DecoratorCheckboxModel(dType, this.decoratorFilterService.getActiveRouterDecorators().includes(dType))
        )
    );
  }

  /**
   * Creates decorators of host category checkboxes from HostNodeDecoratorTypeEnum, adds itself to appropriate category
   * and decides if it should be checked or unchecked based on active host decorators retrieved from filter service
   */
  private createHostTypeCheckboxes() {
    Object.values(HostNodeDecoratorTypeEnum).forEach((dType) =>
      this.categoryCheckboxes
        .find((c) => c.categoryType === DecoratorCategoryEnum.HostDecorators)
        .decoratorCheckboxes.push(
          new DecoratorCheckboxModel(dType, this.decoratorFilterService.getActiveHostDecorators().includes(dType))
        )
    );
  }

  /**
   * Creates decorators of host category checkboxes from LinkDecoratorTypeEnum, adds itself to appropriate category
   * and decides if it should be checked or unchecked based on active link decorators retrieved from filter service
   */
  private createLinkTypeCheckboxes() {
    Object.values(LinkDecoratorTypeEnum).forEach((dType) =>
      this.categoryCheckboxes
        .find((c) => c.categoryType === DecoratorCategoryEnum.LinkDecorators)
        .decoratorCheckboxes.push(
          new DecoratorCheckboxModel(dType, this.decoratorFilterService.getActiveLinkDecorators().includes(dType))
        )
    );
  }

  private subscribeStateChanges() {
    this._stateSubscription = this.decoratorStateService.activeObs.subscribe((value) => {
      this.showDecoratorsFilterMenu = value;
      if (this.showDecoratorsFilterMenu) {
        this.turnOnAllCheckboxes();
      } else {
        this.turnOffAllCheckboxes();
      }
    });
  }

  ngOnDestroy() {
    if (this._stateSubscription) {
      this._stateSubscription.unsubscribe();
    }
  }
}
