import { Component, Input, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecoratorTimeService } from '../../../../services/decorator-time.service';
import { DecoratorStateService } from '../../../../services/decorator-state.service';

@Component({
  selector: 'app-absolute-time',
  templateUrl: './absolute-time.component.html',
  styleUrls: ['./absolute-time.component.css'],
})
export class AbsoluteTimeComponent implements OnDestroy {
  readonly hours = [...Array(24).keys()];
  readonly minutes = [...Array(60).keys()];
  readonly seconds = [...Array(60).keys()];

  @Input() manualDateEnabled;

  decoratorsActive: boolean;

  fromDate: Date = new Date();
  fromTimeHours;
  fromTimeMinutes;
  fromTimeSeconds;

  toDate: Date = new Date();
  toTimeHours;
  toTimeMinutes;
  toTimeSeconds;

  private _stateSubscription;

  constructor(
    public snackBar: MatSnackBar,
    private decoratorTimeService: DecoratorTimeService,
    private decoratorStateService: DecoratorStateService,
  ) {
    this.setInitialValues();
    this.subscribeState();
  }

  /**
   * Sets current time as values for TO time selectors
   */
  setToTimeNow() {
    this.toDate = new Date(Date.now());
    this.toTimeHours = this.toDate.getHours();
    this.toTimeMinutes = this.toDate.getMinutes();
    this.toTimeSeconds = this.toDate.getSeconds();
  }

  /**
   * Sets current time as values for FROM time selectors
   */
  setFromTimeNow() {
    this.fromDate = new Date(Date.now());
    this.fromTimeHours = this.fromDate.getHours();
    this.fromTimeMinutes = this.fromDate.getMinutes();
    this.fromTimeSeconds = this.fromDate.getSeconds();
  }

  /**
   * Sets the chosen time as a time to use for upper layers and time service
   */
  setAbsoluteTime() {
    if (this.InputTimeIsNotNull()) {
      const fromTime = new Date(this.fromDate);
      fromTime.setHours(this.fromTimeHours, this.fromTimeMinutes, this.fromTimeSeconds);

      const toTime = new Date(this.toDate);
      toTime.setHours(this.toTimeHours, this.toTimeMinutes, this.toTimeSeconds);
      if (this.isValidTime(fromTime, toTime)) {
        const snackBarRef = this.snackBar.open('Decorators time was set successfully.')._dismissAfter(1500);

        this.decoratorTimeService.setAbsoluteTime(fromTime.valueOf(), toTime.valueOf());
      } else {
        const snackBarRef = this.snackBar
          .open('"From" date cannot be larger than "to" date.', 'OK')
          ._dismissAfter(4000);
      }
    } else {
      const snackBarRef = this.snackBar.open('All inputs must be filled in.', 'OK')._dismissAfter(4000);
    }
  }

  /**
   * Checks if all necessary input fields are selected
   * @returns {boolean} true if all input fields are selected, false otherwise
   */
  private InputTimeIsNotNull(): boolean {
    return (
      this.fromDate != null &&
      this.fromTimeHours != null &&
      this.fromTimeMinutes != null &&
      this.fromTimeSeconds != null &&
      this.toDate != null &&
      this.toTimeHours != null &&
      this.toTimeMinutes != null &&
      this.toTimeSeconds != null
    );
  }

  /**
   * Checks if from time is before the to time
   * @param {Date} fromTime
   * @param {Date} toTime
   * @returns {boolean} true if from time is before to time, false otherwise
   */
  private isValidTime(fromTime: Date, toTime: Date): boolean {
    return fromTime <= toTime;
  }

  /**
   * Sets initial values to the date picker and selectors
   */
  private setInitialValues() {
    this.decoratorsActive = this.decoratorStateService.getActive();

    this.fromDate = new Date(Date.now());
    this.fromTimeHours = 12;
    this.fromTimeMinutes = 0;
    this.fromTimeSeconds = 0;

    this.toDate = new Date(Date.now());
    this.toTimeHours = 12;
    this.toTimeMinutes = 30;
    this.toTimeSeconds = 0;
  }

  private subscribeState() {
    this._stateSubscription = this.decoratorStateService.activeObs.subscribe((value) => {
      this.decoratorsActive = value;
    });
  }

  ngOnDestroy() {
    if (this._stateSubscription) {
      this._stateSubscription.unsubscribe();
    }
  }
}
