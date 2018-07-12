import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RelativeTimeComponent} from './relative-time.component';
import {DecoratorTimeService} from '../../../../services/decorator-time.service';
import {MockDecoratorReloadTimerService} from '../../../../services/tests/mock-decorator-reload-timer.service';
import {MockDecoratorTimeService} from '../../../../services/tests/mock-decorator-time.service';
import {MatSnackBar, MatSnackBarRef} from '@angular/material';
import {TimeAlgebraOperatorEnum} from '../../../../model/enums/time-algebra-operator-enum';
import {TimeUnitEnum} from '../../../../model/enums/time-unit-enum';
import {AppModule} from '../../../../app.module';
import {GraphModule} from '../../../graph.module';
import {GraphMaterialModule} from '../../../graph-material.module';
import {APP_BASE_HREF} from '@angular/common';

let fixture: ComponentFixture<RelativeTimeComponent>;
let component: RelativeTimeComponent;

let timeService: DecoratorTimeService;
let snackBarSpy:  { open: jasmine.Spy };

describe('RelativeTimeComponent', () => {
  beforeEach(() => {

    const eventServiceSpy = jasmine.createSpyObj(
      'DecoratorEventService',
      [
        'triggerNodeDecoratorsRemoved',
        'triggerNodeDecoratorsLoaded',
        'triggerLinkDecoratorsLoaded',
        'triggerLinkDecoratorsRemoved',
        'triggerDecoratorReloadRequest'
      ]);

    snackBarSpy = jasmine.createSpyObj(
      'MatSnackBar',
      ['open']
    );

    const reloadServiceMock = new MockDecoratorReloadTimerService();
    const timeServiceMock = new MockDecoratorTimeService(reloadServiceMock, eventServiceSpy);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        GraphModule,
        GraphMaterialModule,
      ],
      providers: [
        RelativeTimeComponent,
        {provide: DecoratorTimeService, useValue: timeServiceMock},
        {provide: MatSnackBar, useValue: snackBarSpy},
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelativeTimeComponent);
    component = fixture.componentInstance;

    timeService = TestBed.get(DecoratorTimeService);
  });

  it('should have created the component', () => {
    expect(component).toBeDefined();
  });

  it('should have created all possible options for the select dropdown', () => {
    const possibleOptionsAmount = Object.values(TimeAlgebraOperatorEnum).length * Object.values(TimeUnitEnum).length;
    expect(component.fromOptions.length).toEqual(possibleOptionsAmount);
    expect(component.toOptions.length).toEqual(possibleOptionsAmount);
  });

  it('should have set valid time', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);

    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromOption = component.fromOptions[0];
    component.fromAmount = 10;
    component.toOption = component.toOptions[0];
    component.toAmount = 5;

    const timeSpy = spyOn(timeService, 'setRelativeTime');

    component.setRelativeTime();

    expect(timeService.setRelativeTime).toHaveBeenCalledTimes(1);
    expect(timeService.setRelativeTime).toHaveBeenCalledWith('now-10s', 'now-5s');
  });

  it('should have set valid time (from equals to)', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);

    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromOption = component.fromOptions[0];
    component.fromAmount = 10;
    component.toOption = component.toOptions[0];
    component.toAmount = 10;

    const timeSpy = spyOn(timeService, 'setRelativeTime');
    component.setRelativeTime();
    expect(timeService.setRelativeTime).toHaveBeenCalledTimes(1);
    expect(timeService.setRelativeTime).toHaveBeenCalledWith('now-10s', 'now-10s');
  });

  it('should have not set invalid time (from after to)', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);

    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromOption = component.fromOptions[0];
    component.fromAmount = 5;
    component.toOption = component.toOptions[0];
    component.toAmount = 10;

    const timeSpy = spyOn(timeService, 'setRelativeTime');
    component.setRelativeTime();
    expect(timeService.setRelativeTime).toHaveBeenCalledTimes(0);
  });

  it('should have not set invalid time (null)', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);

    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromOption = component.fromOptions[0];
    component.fromAmount = null;
    component.toOption = component.toOptions[0];
    component.toAmount = null;

    const timeSpy = spyOn(timeService, 'setRelativeTime');
    component.setRelativeTime();
    expect(timeService.setRelativeTime).toHaveBeenCalledTimes(0);
  });

  it('should have not set invalid time (amount out of bounds)', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);

    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromOption = component.fromOptions[0];
    component.fromAmount = 15610;
    component.toOption = component.toOptions[0];
    component.toAmount = -100;

    const timeSpy = spyOn(timeService, 'setRelativeTime');
    component.setRelativeTime();
    expect(timeService.setRelativeTime).toHaveBeenCalledTimes(0);
  });

});
