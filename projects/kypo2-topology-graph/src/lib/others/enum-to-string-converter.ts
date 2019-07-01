import {LinkDecoratorTypeEnum} from '../model/enums/link-decorator-type-enum';
import {DecoratorCategoryEnum} from '../model/enums/decorator-category-enum';
import {RouterNodeDecoratorTypeEnum} from '../model/enums/router-node-decorator-type-enum';
import {HostNodeDecoratorTypeEnum} from '../model/enums/host-node-decorator-type-enum';

/**
 * Class containing all static methods used for converting enum to string (usually mapping from model to json posts etc.)
 */
export class EnumToStringConverter {
  /**
   * Converts decorator type to string accepted by backend
   * @param {DecoratorCategoryEnum} categoryDecoratorType  category of provided decorator type
   * @param decoratorType type of decorator (enum)
   * @returns {string} converted string, null if no matching type is found or type is inconsistent with category type
   */
  static decoratorEnumToRestString(categoryDecoratorType: DecoratorCategoryEnum,
                                   decoratorType: RouterNodeDecoratorTypeEnum
                                 | HostNodeDecoratorTypeEnum
                                 | LinkDecoratorTypeEnum): string {

    if (categoryDecoratorType === null || decoratorType === null) {
      return null;
    }

    switch (categoryDecoratorType) {
      case DecoratorCategoryEnum.RouterDecorators:
        return this.routerDecoratorTypeToString(decoratorType as RouterNodeDecoratorTypeEnum);
      case DecoratorCategoryEnum.HostDecorators:
        return this.hostDecoratorTypeToString(decoratorType as HostNodeDecoratorTypeEnum);
      case DecoratorCategoryEnum.LinkDecorators:
        return this.linkDecoratorTypeToString(decoratorType as LinkDecoratorTypeEnum);
    }
  }

  /**
   *
   * Converts router decorator type to string in format accepted by server
   * @param decoratorType type of decorator to be converted
   * @returns {string} result string, null if incorrect decorator type was provided.
   */
  private static routerDecoratorTypeToString(decoratorType: RouterNodeDecoratorTypeEnum): string {
    switch (decoratorType) {
      case RouterNodeDecoratorTypeEnum.LogicalRoleDecorator:
        return 'assigned-logical-role';
      default:
        return null;
    }
  }

  /**
   * Converts host decorator type to string in format accepted by server
   * @param decoratorType type of decorator to be converted
   * @returns {string} result string, null if incorrect decorator type was provided.
   */
  private static hostDecoratorTypeToString(decoratorType: HostNodeDecoratorTypeEnum): string {
    switch (decoratorType) {
      case HostNodeDecoratorTypeEnum.NodeStatusDecorator:
        return 'status';
      case HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator:
        return 'assigned-logical-role';
      case HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator:
        return 'semaphore';
      default:
        return null;
    }
  }

  /**
   * Converts link decorator type to string in format accepted by backend
   * @param decoratorType type of decorator to be converted
   * @returns {string} result string, null if incorrect decorator type was provided.
   */
  private static linkDecoratorTypeToString(decoratorType: LinkDecoratorTypeEnum): string {
    switch (decoratorType) {
      case LinkDecoratorTypeEnum.LinkMailDecorator:
        return 'mail';
      case LinkDecoratorTypeEnum.LinkSpeedDecorator:
        return 'speed';
      default:
        return null;
    }
  }
}
