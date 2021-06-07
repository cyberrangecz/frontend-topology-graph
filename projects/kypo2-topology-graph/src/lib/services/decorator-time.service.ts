import {Injectable, OnDestroy} from '@angular/core';
import {DecoratorReloadTimerService} from './decorator-reload-timer.service';
import {DecoratorEventService} from './decorator-event.service';
import {DecoratorCategoryEnum} from '../model/enums/decorator-category-enum';
import {Observable, Subject} from 'rxjs';
import {DurationInputArg2, Moment} from 'moment-mini';
import {ConfigService} from './config.service';
import * as moment_ from 'moment-mini';

const moment = moment_;

/**
 * Service passing the time which should be used when requesting for decorators
 */
@Injectable()
export class DecoratorTimeService implements OnDestroy {

  private _useRealTime = true;

  private _from: string | number;
  private _to: string | number;

  private _onRealTimeChangeSubject: Subject<boolean> = new Subject();
  onRealTimeChange: Observable<boolean> = this._onRealTimeChangeSubject.asObservable();


  private _decoratorReloadSubscription;

  constructor(
    private configService: ConfigService,
    private decoratorReloadTimerService: DecoratorReloadTimerService,
    private decoratorEventService: DecoratorEventService) {

    this.subscribeDecoratorReload();
    this.setInitialValues();

  }

  /**
   * Sets the application to use the current time (real-time mode) or not
   * @param {boolean} value true if real-time mode should be used, false if not
   */
  setUseRealTime(value: boolean) {
    this._useRealTime = value;
    this._onRealTimeChangeSubject.next(this._useRealTime);

    if (this._useRealTime) {
      this.decoratorReloadTimerService.turnOnAutomaticReload();
    } else {
      this.decoratorReloadTimerService.turnOffAutomaticReload();
    }
  }

  getUseRealTime(): boolean {
    return this._useRealTime;
  }

  getFromTime(): number | string {
    if (this._useRealTime) {
      return 'now-' + this.decoratorReloadTimerService.getReloadPeriod() + 's';
    } else {
      return this._from;
    }
  }

  getToTime(): number | string {
    if (this._useRealTime) {
      return 'now';
    } else {
      return this._to;
    }
  }

  /**
   * Sets relative time to be used for reloading decorators
   * FORMAT: now - operator - number - unit
   *    operators: + -
   *    unit: s, m, h, d, w, M, y
   * Example: 'now+30m' means a time 30 minutes from now.
   * @param {string} from 'from' relative time
   * @param {string} to 'to' relative time
   */
  setRelativeTime(from: string, to: string) {
    if (!this._useRealTime && this.validateRelativeTime(from, to)) {
      this._from = from;
      this._to = to;
      this.reloadAllDecorators();
    }
  }

  /**
   * Sets absolute time to be used for reloading decorators. Absolute time is a unix epoch timestamp in ms.
   * @param {number} from 'from' absolute time
   * @param {number} to 'to' absolute time
   */
  setAbsoluteTime(from: number, to: number) {
    if (!this._useRealTime && this.validateAbsoluteTime(from, to)) {
      this._from = from;
      this._to = to;
      this.reloadAllDecorators();
    }
  }

  private validateAbsoluteTime(from: number, to: number) {
    return from !== null
    && from !== undefined
    && to !== null
    && to !== undefined
    && from <= to;
  }

  private validateRelativeTime(from: string, to: string) {
    return from !== null
    && from !== undefined
    && to !== null
    && to !== undefined
    && this.isValidConvertedRelativeTime(from, to);
  }

  private isValidConvertedRelativeTime(from: string, to: string): boolean {
    const now = moment();
    const firstMoment = this.convertToMoment(now, from);
    const secondMoment = this.convertToMoment(now, to);
    if (!firstMoment || ! secondMoment) {
      return false;
    }
    return firstMoment.isBefore(secondMoment) || firstMoment.isSame(secondMoment);
  }

  private convertToMoment(now: Moment, relativeTime: string): Moment {
    const converted = moment(now);
    const matched = relativeTime.match('(now)([+,-])(\\d+)([s,m,h,d,M,y])$');
    if (matched && matched.length === 5) {
      const operator = matched[2];
      const value: moment_.DurationInputArg1 = matched[3];
      const timeUnit: moment_.DurationInputArg2 = matched[4] as DurationInputArg2;

      if (operator === '-') {
        return converted.subtract(value, timeUnit);
      } else if (operator === '+') {
        return converted.add(value, timeUnit);
      }
      return null;
    }
  }

  /**
   * Triggers event to request reload of all decorators
   */
  private reloadAllDecorators() {
    this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.RouterDecorators, null);
    this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.HostDecorators, null);
    this.decoratorEventService.triggerDecoratorReloadRequest(DecoratorCategoryEnum.LinkDecorators, null);
  }

  private subscribeDecoratorReload() {
    this._decoratorReloadSubscription = this.decoratorReloadTimerService.onReloadPeriodChange.subscribe(
      (value) => {
          this._useRealTime = value > 0;
          this._onRealTimeChangeSubject.next(this._useRealTime);
      });
  }

  private setInitialValues() {
    this._useRealTime = this.configService.config.useRealTime;
    if (this._useRealTime) {
      this._from = 'now-' + this.decoratorReloadTimerService.getReloadPeriod() + 's';
      this._to = 'now';
    }
  }

  ngOnDestroy() {
    if (this._decoratorReloadSubscription) {
      this._decoratorReloadSubscription.unsubscribe();
    }
  }
}
