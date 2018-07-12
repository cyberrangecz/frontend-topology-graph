import {AbsoluteTimeComponent} from './absolute-time.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DecoratorTimeService} from '../../../../services/decorator-time.service';
import {MockDecoratorReloadTimerService} from '../../../../services/tests/mock-decorator-reload-timer.service';
import {MockDecoratorTimeService} from '../../../../services/tests/mock-decorator-time.service';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {GraphMaterialModule} from '../../../graph-material.module';
import {GraphModule} from '../../../graph.module';
import {MatSnackBar} from '@angular/material';
import {APP_BASE_HREF} from '@angular/common';
import {TimeAlgebraOperatorEnum} from '../../../../model/enums/time-algebra-operator-enum';
import {TimeUnitEnum} from '../../../../model/enums/time-unit-enum';

let fixture: ComponentFixture<AbsoluteTimeComponent>;
let component: AbsoluteTimeComponent;

let timeService: DecoratorTimeService;
let snackBarSpy: {open: jasmine.Spy};


describe('AbsoluteTimeComponent', () => {
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
        AbsoluteTimeComponent,
        {provide: DecoratorTimeService, useValue: timeServiceMock},
        {provide: MatSnackBar, useValue: snackBarSpy},
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AbsoluteTimeComponent);
    component = fixture.componentInstance;

    timeService = TestBed.get(DecoratorTimeService);
  });

  it('should have created the component', () => {
    expect(component).toBeDefined();
  });

  it('should have created initial values', () => {
    expect(component.fromDate).toBeDefined();
    expect(component.fromDate).not.toBeNull();
    expect(component.fromTimeHours).toBeDefined();
    expect(component.fromTimeHours).not.toBeNull();
    expect(component.fromTimeMinutes).toBeDefined();
    expect(component.fromTimeMinutes).not.toBeNull();
    expect(component.fromTimeSeconds).toBeDefined();
    expect(component.fromTimeSeconds).not.toBeNull();

    expect(component.toDate).toBeDefined();
    expect(component.toDate).not.toBeNull();
    expect(component.toTimeHours).toBeDefined();
    expect(component.toTimeHours).not.toBeNull();
    expect(component.toTimeMinutes).toBeDefined();
    expect(component.toTimeMinutes).not.toBeNull();
    expect(component.toTimeSeconds).toBeDefined();
    expect(component.toTimeSeconds).not.toBeNull();
  });

  it('should have set valid time', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);
    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromDate = new Date(2018, 1, 15);
    component.fromTimeHours = 12;
    component.fromTimeMinutes = 30;
    component.fromTimeSeconds = 30;

    component.toDate = new Date(2018, 1, 15);
    component.toTimeHours = 12;
    component.toTimeMinutes = 30;
    component.toTimeSeconds = 31;

    const timeSpy = spyOn(timeService, 'setAbsoluteTime');

    component.setAbsoluteTime();

    expect(timeService.setAbsoluteTime).toHaveBeenCalledTimes(1);
    expect(timeService.setAbsoluteTime).toHaveBeenCalledWith(
      new Date(2018, 1, 15, 12, 30, 30).valueOf(),
      new Date(2018, 1, 15, 12, 30, 31).valueOf()
    );
  });

  it('should have set valid time (from equals to)', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);
    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromDate = new Date(2018, 1, 15);
    component.fromTimeHours = 12;
    component.fromTimeMinutes = 30;
    component.fromTimeSeconds = 30;

    component.toDate = new Date(2018, 1, 15);
    component.toTimeHours = 12;
    component.toTimeMinutes = 30;
    component.toTimeSeconds = 30;

    const timeSpy = spyOn(timeService, 'setAbsoluteTime');

    component.setAbsoluteTime();

    expect(timeService.setAbsoluteTime).toHaveBeenCalledTimes(1);
    expect(timeService.setAbsoluteTime).toHaveBeenCalledWith(
      new Date(2018, 1, 15, 12, 30, 30).valueOf(),
      new Date(2018, 1, 15, 12, 30, 30).valueOf()
    );
  });

  it('should have not set invalid time (from after to)', () => {
    const snackRefMock = jasmine.createSpyObj(
      'MatSnackBarRef',
      [
        '_dismissAfter',
      ]);
    snackBarSpy.open.and.returnValue(snackRefMock);

    component.fromDate = new Date(2018, 1, 15);
    component.fromTimeHours = 12;
    component.fromTimeMinutes = 30;
    component.fromTimeSeconds = 30;

    component.toDate = new Date(2018, 1, 15);
    component.toTimeHours = 12;
    component.toTimeMinutes = 30;
    component.toTimeSeconds = 29;

    const timeSpy = spyOn(timeService, 'setAbsoluteTime');

    component.setAbsoluteTime();
    expect(timeService.setAbsoluteTime).toHaveBeenCalledTimes(0);
  });
});
