import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, Subject} from 'rxjs';

/**
 * Service for managing time period in which decorators are reloaded.
 */
@Injectable()
export class DecoratorReloadTimerService {

  static  MIN_VALUE = 0;
  static  MAX_VALUE = 20;

  private _currentReloadPeriod: number;
  private _previousReloadPeriod: number;

  private _onReloadPeriodChangeSubject: Subject<number> = new Subject();
  onReloadPeriodChange: Observable<number> = this._onReloadPeriodChangeSubject.asObservable();

  constructor() {
    this.setInitialValues();
  }

  getReloadPeriod(): number {
    return this._currentReloadPeriod;
  }

  /**
   * Sets reload period to given value. Must be within possible limits
   * @param {number} value
   */
  setReloadPeriod(value: number) {
    const newReloadPeriod = this.checkBoundaries(value);
    if (newReloadPeriod === 0) {
      this.turnOffAutomaticReload();
    } else {
      this._currentReloadPeriod = newReloadPeriod;
      this._onReloadPeriodChangeSubject.next(this._currentReloadPeriod);
    }
  }

  /**
   * Turns off automatic reload of decorators
   */
  turnOffAutomaticReload() {
    this._previousReloadPeriod = this._currentReloadPeriod;
    this._currentReloadPeriod = 0;
    this._onReloadPeriodChangeSubject.next(this._currentReloadPeriod);
  }

  /**
   * Turns on automatic reload of decorators
   */
  turnOnAutomaticReload() {
    this._currentReloadPeriod = this._previousReloadPeriod;
    this._onReloadPeriodChangeSubject.next(this._currentReloadPeriod);
  }

  /**
   * Checks if current value is within limits of min and max value.
   * Returns value if true, min or max value otherwise.
   * @param {number} value number to check
   * @returns {number} Returns value if true, min or max value otherwise.
   */
  private checkBoundaries(value: number): number {
    let result = value > DecoratorReloadTimerService.MIN_VALUE  ? value : DecoratorReloadTimerService.MIN_VALUE;
    result = value < DecoratorReloadTimerService.MAX_VALUE ? result : DecoratorReloadTimerService.MAX_VALUE;
    return result;
  }

  private setInitialValues() {
    if (environment.useRealTime) {
      this._currentReloadPeriod = environment.defaultDecoratorRefreshPeriodInSeconds;
    } else {
      this._currentReloadPeriod = 0;
    }
    this._previousReloadPeriod = this._currentReloadPeriod;
  }
}
