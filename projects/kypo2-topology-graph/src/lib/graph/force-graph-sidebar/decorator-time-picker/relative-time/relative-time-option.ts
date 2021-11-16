import { TimeAlgebraOperatorEnum } from '../../../../model/enums/time-algebra-operator-enum';
import { TimeUnitEnum } from '../../../../model/enums/time-unit-enum';
import { Moment } from 'moment-mini';
import * as moment_ from 'moment-mini';

const moment = moment_;

/**
 * A model for relative time. Consists of value, time unit and operator.
 */
export class RelativeTimeOption {
  private operator: TimeAlgebraOperatorEnum;
  private timeUnit: TimeUnitEnum;

  private value: number;

  private displayString: string;

  constructor(operator: TimeAlgebraOperatorEnum, timeUnit: TimeUnitEnum) {
    this.operator = operator;
    this.timeUnit = timeUnit;
    this.value = 0;
    this.createDisplayString();
  }

  /**
   * Creates strings which should be displayed in visual component
   */
  private createDisplayString() {
    switch (this.timeUnit) {
      case TimeUnitEnum.Seconds: {
        this.displayString = 'seconds';
        break;
      }
      case TimeUnitEnum.Minutes: {
        this.displayString = 'minutes';
        break;
      }
      case TimeUnitEnum.Hours: {
        this.displayString = 'hours';
        break;
      }
      case TimeUnitEnum.Days: {
        this.displayString = 'days';
        break;
      }
      case TimeUnitEnum.Weeks: {
        this.displayString = 'weeks';
        break;
      }
      case TimeUnitEnum.Months: {
        this.displayString = 'months';
        break;
      }
      case TimeUnitEnum.Years: {
        this.displayString = 'years';
        break;
      }
    }

    switch (this.operator) {
      case TimeAlgebraOperatorEnum.Minus: {
        this.displayString += ' ago';
        break;
      }
      case TimeAlgebraOperatorEnum.Plus: {
        this.displayString += ' from now';
        break;
      }
    }
  }

  getDisplayString(): string {
    return this.displayString;
  }

  getOperator(): TimeAlgebraOperatorEnum {
    return this.operator;
  }

  getTimeUnit(): TimeUnitEnum {
    return this.timeUnit;
  }

  setInputValue(value: number) {
    this.value = value;
  }

  /**
   * Compares time option to another and returns whether the first one is before (meaning earlier in time) the second or not
   * @param {RelativeTimeOption} timeOption time option to compare
   * @returns {boolean} true if the first one is before (meaning earlier in time) the second, false otherwise
   */
  isBefore(timeOption: RelativeTimeOption): boolean {
    if (this.value !== undefined && timeOption.value !== undefined) {
      const now = moment();
      const firstMoment = this.convertToMoment(now, this);
      const secondMoment = this.convertToMoment(now, timeOption);
      return firstMoment.isBefore(secondMoment);
    }
    // error
    return false;
  }

  /**
   * Compares time option to another and returns whether the first one is after (meaning earlier in time) the second or not
   * @param {RelativeTimeOption} timeOption time option to compare
   * @returns {boolean} true if the first one is after (meaning earlier in time) the second, false otherwise
   */
  isAfter(timeOption: RelativeTimeOption): boolean {
    if (this.value && timeOption.value) {
      const now = moment();
      const firstMoment = this.convertToMoment(now, this);
      const secondMoment = this.convertToMoment(now, timeOption);

      return firstMoment.isAfter(secondMoment);
    }
    // error
    return false;
  }

  /**
   * Compares time option to another and returns whether the first one is in the same time as the second one or not
   * @param {RelativeTimeOption} timeOption time option to compare
   * @returns {boolean} true if the first one is in the same time as the second one, false otherwise
   */
  isSame(timeOption: RelativeTimeOption): boolean {
    if (this.value && timeOption.value) {
      const now = moment();
      const firstMoment = this.convertToMoment(now, this);
      const secondMoment = this.convertToMoment(now, timeOption);

      return firstMoment.isSame(secondMoment);
    }
    // error
    return false;
  }

  /**
   * Helper method to convert the option from time algebra to moment.s time
   * @param {moment.Moment} now a current time to compare the relative time to
   * (used as a parameter so it could be injected when converting more options which should be relative to the same "now" time)
   * @param {RelativeTimeOption} relTime a time option which should be converted
   * @returns {moment.Moment} moment.js time converted from the relative options
   */
  private convertToMoment(now: Moment, relTime: RelativeTimeOption): Moment {
    const converted = moment(now);

    if (relTime.getOperator() === TimeAlgebraOperatorEnum.Plus) {
      return converted.add(relTime.value, relTime.getTimeUnit());
    }
    if (relTime.getOperator() === TimeAlgebraOperatorEnum.Minus) {
      return converted.subtract(relTime.value, relTime.getTimeUnit());
    }

    return null;
  }
}
