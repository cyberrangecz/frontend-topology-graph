import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecoratorTimeService } from '../../../services/decorator-time.service';
import { DecoratorReloadTimerService } from '../../../services/decorator-reload-timer.service';
import { DecoratorStateService } from '../../../services/decorator-state.service';

@Component({
  selector: 'app-decorator-time-picker',
  templateUrl: './decorator-time-picker.component.html',
  styleUrls: ['./decorator-time-picker.component.css'],
})
export class DecoratorTimePickerComponent implements OnDestroy {
  useRealTime: boolean;
  activeDecorators: boolean;

  private _timeSubscription;
  private _stateSubscription;

  constructor(
    private decoratorReloadTimerService: DecoratorReloadTimerService,
    private decoratorTimeService: DecoratorTimeService,
    private decoratorStateService: DecoratorStateService
  ) {
    this.useRealTime = this.decoratorTimeService.getUseRealTime();
    this.activeDecorators = this.decoratorStateService.getActive();
    this.subscribeTime();
    this.subscribeState();
  }

  /**
   * Toggles between manual date pick and real-time mode
   */
  toggleManualDate() {
    this.useRealTime = !this.useRealTime;
    this.decoratorTimeService.setUseRealTime(this.useRealTime);
  }

  /**
   * Subscription to the time service
   */
  private subscribeTime() {
    this._timeSubscription = this.decoratorTimeService.onRealTimeChange.subscribe((value) => {
      this.useRealTime = value;
    });
  }

  private subscribeState() {
    this._stateSubscription = this.decoratorStateService.activeObs.subscribe((value) => {
      this.activeDecorators = value;
    });
  }

  ngOnDestroy() {
    if (this._timeSubscription) {
      this._timeSubscription.unsubscribe();
    }
    if (this._stateSubscription) {
      this._stateSubscription.unsubscribe();
    }
  }
}
