import { Component, Input, OnDestroy } from '@angular/core';
import { RelativeTimeOption } from './relative-time-option';
import { TimeAlgebraOperatorEnum } from '../../../../model/enums/time-algebra-operator-enum';
import { TimeUnitEnum } from '../../../../model/enums/time-unit-enum';
import { DecoratorTimeService } from '../../../../services/decorator-time.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecoratorStateService } from '../../../../services/decorator-state.service';

@Component({
  selector: 'app-relative-time',
  templateUrl: './relative-time.component.html',
  styleUrls: ['./relative-time.component.css'],
})
export class RelativeTimeComponent implements OnDestroy {
  readonly MIN = 0;
  readonly MAX = 100;

  @Input() manualDateEnabled;

  fromOptions: RelativeTimeOption[] = [];
  toOptions: RelativeTimeOption[] = [];

  fromOption: RelativeTimeOption;
  fromAmount: number;

  toOption: RelativeTimeOption;
  toAmount: number;

  activeDecorators: boolean;

  private _stateSubscription;

  constructor(
    private snackBar: MatSnackBar,
    private decoratorTimeService: DecoratorTimeService,
    private decoratorStateService: DecoratorStateService,
  ) {
    this.setInitialValues();
    this.subscribeState();
  }

  /**
   * Creates select options and sets initial values to inputs
   */
  setInitialValues() {
    Object.values(TimeAlgebraOperatorEnum).forEach((operator) => {
      Object.values(TimeUnitEnum).forEach((timeUnit) => {
        this.fromOptions.push(new RelativeTimeOption(operator, timeUnit));
      });
    });

    Object.values(TimeAlgebraOperatorEnum).forEach((operator) => {
      Object.values(TimeUnitEnum).forEach((timeUnit) => {
        this.toOptions.push(new RelativeTimeOption(operator, timeUnit));
      });
    });

    this.fromAmount = 0;
    this.toAmount = 0;
    this.fromOption = this.fromOptions[0];
    this.toOption = this.toOptions[0];

    this.activeDecorators = this.decoratorStateService.getActive();
  }

  /**
   * Sets chosen relative time to the time service
   */
  setRelativeTime() {
    if (this.isValidInputNumber()) {
      this.fromOption.setInputValue(this.fromAmount);
      this.toOption.setInputValue(this.toAmount);

      if (this.isValidTime()) {
        this.decoratorTimeService.setRelativeTime(
          this.getEquation(this.fromAmount, this.fromOption),
          this.getEquation(this.toAmount, this.toOption),
        );

        const snackBarRef = this.snackBar.open('Decorator time was set succesfully')._dismissAfter(1500);
      } else {
        const snackBarRef = this.snackBar
          .open('"From" date cannot be larger than "to" date.', 'OK')
          ._dismissAfter(4000);
      }
    }
  }

  /**
   * Converts the relative time option to string for the upper layers and services
   * FORMAT: now - operator - number - unit
   *    operators: + -
   *    unit: s, m, h, d, w, M, y
   * Example: 'now+30m' means a time 30 minutes from now.
   *
   * @param {number} amount number in the equation
   * @param {RelativeTimeOption} option relative time option - operator and unit
   * @returns {string} created equation for upper layers
   */
  private getEquation(amount: number, option: RelativeTimeOption): string {
    return 'now' + option.getOperator() + amount + option.getTimeUnit();
  }

  /**
   * Checks whether input is valid
   * @returns {boolean} true if valid, false otherwise
   */
  private isValidInputNumber(): boolean {
    return (
      this.fromAmount !== undefined &&
      this.fromAmount >= this.MIN &&
      this.fromAmount <= this.MAX &&
      this.toAmount !== undefined &&
      this.toAmount >= this.MIN &&
      this.toAmount <= this.MAX
    );
  }

  /**
   * Checks whether the selected time is valid to use. (FROM must not be after TO)
   * @returns {boolean} true is time is valid, false otherwise
   */
  private isValidTime(): boolean {
    return this.fromOption.isBefore(this.toOption) || this.fromOption.isSame(this.toOption);
  }

  private subscribeState() {
    this._stateSubscription = this.decoratorStateService.activeObs.subscribe((value) => {
      this.activeDecorators = value;
    });
  }

  ngOnDestroy() {
    if (this._stateSubscription) {
      this._stateSubscription.unsubscribe();
    }
  }
}
