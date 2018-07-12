import {DecoratorEventService} from '../decorator-event.service';
import {DecoratorReloadTimerService} from '../decorator-reload-timer.service';
import {DecoratorTimeService} from '../decorator-time.service';
import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {MockDecoratorReloadTimerService} from './mock-decorator-reload-timer.service';

let timeService: DecoratorTimeService;
let eventService: DecoratorEventService;
let reloadService: DecoratorReloadTimerService;

describe('Decorator time service', () => {
  beforeEach(() => {
    const decoratorEventServiceSpy = jasmine.createSpyObj(
      'DecoratorEventService',
      [
        'triggerNodeDecoratorsRemoved',
        'triggerLinkDecoratorsRemoved',
        'triggerDecoratorReloadRequest'
      ]);

    const mockDecoratorReloadTimer = new MockDecoratorReloadTimerService();

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        DecoratorTimeService,
        {provide: DecoratorEventService, useValue: decoratorEventServiceSpy},
        {provide: DecoratorReloadTimerService, useValue: mockDecoratorReloadTimer}
      ]
    });

    eventService = TestBed.get(DecoratorEventService);
    reloadService = TestBed.get(DecoratorReloadTimerService);
    timeService = TestBed.get(DecoratorTimeService);
  });

  it('should have returned time as a timestamp', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = Date.UTC(2017, 5, 25, 12, 0, 0);
    const expectedToTime = Date.UTC(2017, 5, 26, 12, 0, 0);
    timeService.setAbsoluteTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).toEqual(expectedFromTime.valueOf());
    expect(timeService.getToTime()).toEqual(expectedToTime.valueOf());
  });

  it('should have returned time as a relative time string', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = 'now-10s';
    const expectedToTime = 'now-5s';
    timeService.setRelativeTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).toEqual(expectedFromTime);
    expect(timeService.getToTime()).toEqual(expectedToTime);
  });

  it('should have validate absolute time if is from and to are the same', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = Date.UTC(2017, 5, 25, 12, 0, 0);
    const expectedToTime = Date.UTC(2017, 5, 25, 12, 0, 0);
    timeService.setAbsoluteTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).toEqual(expectedFromTime);
    expect(timeService.getToTime()).toEqual(expectedToTime);
  });

  it('should have validate relative time if is from and to are the same', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = 'now-2M';
    const expectedToTime = 'now-2M';
    timeService.setRelativeTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).toEqual(expectedFromTime);
    expect(timeService.getToTime()).toEqual(expectedToTime);
  });

  it('should have not validate absolute time if to time is before from time', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = Date.UTC(2017, 5, 25, 12, 0, 0);
    const expectedToTime = Date.UTC(2017, 5, 24, 12, 0, 0);
    timeService.setAbsoluteTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).not.toEqual(expectedFromTime.valueOf());
    expect(timeService.getToTime()).not.toEqual(expectedToTime.valueOf());
  });

  it('should have not validate relative time if to time is before from time', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = 'now-100s';
    const expectedToTime = 'now-125s';
    timeService.setRelativeTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).not.toEqual(expectedFromTime);
    expect(timeService.getToTime()).not.toEqual(expectedToTime);
  });

  it('should have not validate absolute time if is null', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = null;
    const expectedToTime = null;
    timeService.setAbsoluteTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).not.toEqual(expectedFromTime);
    expect(timeService.getToTime()).not.toEqual(expectedToTime);
  });

  it('should have not validate relative time if is null', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = null;
    const expectedToTime = null;
    timeService.setRelativeTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).not.toEqual(expectedFromTime);
    expect(timeService.getToTime()).not.toEqual(expectedToTime);
  });

  it('should have not validate relative time if is in wrong format', () => {
    timeService.setUseRealTime(false);
    const expectedFromTime = 'nowx10s';
    const expectedToTime = 'nowy70p';
    timeService.setRelativeTime(expectedFromTime, expectedToTime);

    expect(timeService.getFromTime()).not.toEqual(expectedFromTime);
    expect(timeService.getToTime()).not.toEqual(expectedToTime);
  });

  it('should have turned on the real-time mode in reaction to the timer service event', () => {
    timeService.setUseRealTime(false);
    reloadService.turnOnAutomaticReload();
    expect(timeService.getUseRealTime()).toBeTruthy();
  });

  it('should have turned off the real-time mode in reaction to the timer service event', () => {
    timeService.setUseRealTime(true);
    reloadService.turnOffAutomaticReload();
    expect(timeService.getUseRealTime()).toBeFalsy();
  });
});

