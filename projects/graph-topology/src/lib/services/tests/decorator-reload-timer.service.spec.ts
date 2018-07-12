import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {DecoratorReloadTimerService} from '../decorator-reload-timer.service';
import {TestBed} from '@angular/core/testing';

let timerService: DecoratorReloadTimerService;

describe('Decorator reload timer service', () => {
  beforeEach(() => {

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        DecoratorReloadTimerService
      ]
    });

    timerService = TestBed.get(DecoratorReloadTimerService);
  });

  it('should have set the reload period to correct value', () => {
    timerService.setReloadPeriod(15);
    expect(timerService.getReloadPeriod()).toEqual(15);
  });

  it('should have not set the reload period to higher than max value', () => {
    timerService.setReloadPeriod(21);
    expect(timerService.getReloadPeriod()).not.toEqual(21);
  });

  it('should have not set the reload period to lower than min value', () => {
    timerService.setReloadPeriod(-1);
    expect(timerService.getReloadPeriod()).not.toEqual(-1);
  });

  it('should have  set the reload period to value equal to min value', () => {
    timerService.setReloadPeriod(0);
    expect(timerService.getReloadPeriod()).toEqual(0);
  });

  it('should have  set the reload period to value equal to max value', () => {
    timerService.setReloadPeriod(20);
    expect(timerService.getReloadPeriod()).toEqual(20);
  });

  it('should have changed the value of observable after value was set', () => {
    timerService.onReloadPeriodChange.subscribe(
      result => expect(result).toEqual(10));
    timerService.setReloadPeriod(10);
  });

  it('should have set reload period to 0 after turning off automatic reloading', () => {
    timerService.setReloadPeriod(10);
    timerService.turnOffAutomaticReload();
    expect(timerService.getReloadPeriod()).toEqual(0);
  });

  it('should have set reload period to previous value after turning on automatic reloading', () => {
    timerService.setReloadPeriod(10);
    timerService.setReloadPeriod(0);
    timerService.turnOnAutomaticReload();
    expect(timerService.getReloadPeriod()).toEqual(10);
  });
});



