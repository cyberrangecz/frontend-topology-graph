import {NodeSemaphoreDecoratorStatusEnum} from '../model/enums/node-semaphore-decorator-status-enum';
import {NodeLogicalRoleEnum} from '../model/enums/node-logical-role-enum';
import {StatusEnum} from '../model/enums/status-enum';

/**
 * Class containing all static methods used for converting strings to enum (usually mapping from json to model)
 */
export class StringToEnumConverter {

  /**
   * Converts status string retrieved from json to status enum used in decorator model
   * @param {string} input status string
   * @returns {StatusEnum} status enum used in decorator model
   */
  static statusStringToEnum(input: string): StatusEnum {
    switch (input.toLowerCase()) {
      case 'online':
        return StatusEnum.Online;
      case 'offline':
        return StatusEnum.Offline;
      default:
        return StatusEnum.Unknown;
    }
  }

  /**
   * Converts semaphore string retrieved from json to semaphore enum used in decorator model
   * @param {string} input semaphore string
   * @returns {NodeSemaphoreDecoratorStatusEnum} semaphore enum used in decorator model
   */
  static statusSemaphoreStringToEnum(input: string): NodeSemaphoreDecoratorStatusEnum {
    switch (input.toLowerCase()) {
      case 'green':
        return NodeSemaphoreDecoratorStatusEnum.Green;
      case 'orange':
        return NodeSemaphoreDecoratorStatusEnum.Orange;
      case 'red':
        return NodeSemaphoreDecoratorStatusEnum.Red;
      default:
        return null;
    }
  }

  /**
   * Converts logical role string retrieved from json to logical role enum used in decorator model
   * @param {string} input logical role string
   * @returns {NodeLogicalRoleEnum} logical role enum used in decorator model
   */
  static logicalRoleStringToEnum(input: string): NodeLogicalRoleEnum {
    switch (input.toLowerCase()) {
      case 'attacker':
        return NodeLogicalRoleEnum.Attacker;
      case 'bot':
        return NodeLogicalRoleEnum.Bot;
      case 'victim':
        return NodeLogicalRoleEnum.Victim;
      default:
        return null;
    }
  }
}
