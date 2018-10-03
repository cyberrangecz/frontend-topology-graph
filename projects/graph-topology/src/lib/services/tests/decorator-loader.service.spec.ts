import {RouterNodeDecoratorTypeEnum} from '../../model/enums/router-node-decorator-type-enum';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {DecoratorEventService} from '../decorator-event.service';
import {DecoratorFilterService} from '../decorator-filter.service';
import {async, TestBed} from '@angular/core/testing';
import {DecoratorReloadTimerService} from '../decorator-reload-timer.service';
import {DecoratorTimeService} from '../decorator-time.service';
import {DecoratorLoaderService} from '../decorator-loader.service';
import {MockDecoratorTimeService} from './mock-decorator-time.service';
import {MockDecoratorReloadTimerService} from './mock-decorator-reload-timer.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {HostNodeDecoratorTypeEnum} from '../../model/enums/host-node-decorator-type-enum';
import {LinkDecoratorTypeEnum} from '../../model/enums/link-decorator-type-enum';
import {asyncData, testAsync} from '../../testing/async-observable-helpers';
import {RouterNode} from 'graph-topology-model-lib';
import {DecoratorCategoryEnum} from '../../model/enums/decorator-category-enum';
import {LinkDecorator} from '../../model/decorators/link-decorator';
import {LinkSpeedDecorator} from '../../model/decorators/link-speed-decorator';
import {LinkMailDecorator} from '../../model/decorators/link-mail-decorator';
import {LinkDecoratorSpeedEnum} from '../../model/enums/link-decorator-speed-enum';
import {DecoratorStateService} from '../decorator-state.service';

let filterService: DecoratorFilterService;
let eventService: DecoratorEventService;
let timeService: DecoratorTimeService;
let loaderService: DecoratorLoaderService;
let stateService: DecoratorStateService;

let httpClientSpy: { post: jasmine.Spy };

describe('Decorator loader service', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    const eventServiceSpy = jasmine.createSpyObj(
      'DecoratorEventService',
      [
        'triggerNodeDecoratorsRemoved',
        'triggerNodeDecoratorsLoaded',
        'triggerLinkDecoratorsLoaded',
        'triggerLinkDecoratorsRemoved',
        'triggerDecoratorReloadRequest'
      ]);

    const stateServiceSpy = jasmine.createSpyObj('DecoratorStateService',
      ['setActive']);

    const reloadServiceMock = new MockDecoratorReloadTimerService();
    const timeServiceMock = new MockDecoratorTimeService(reloadServiceMock, eventServiceSpy);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        DecoratorLoaderService,
        DecoratorFilterService,
        {provide: DecoratorStateService, useValue: stateServiceSpy},
        {provide: DecoratorEventService, useValue: eventServiceSpy},
        {provide: DecoratorTimeService, useValue: timeServiceMock},
        {provide: HttpClient, useValue: httpClientSpy}
      ]
    });

    filterService = TestBed.get(DecoratorFilterService);
    eventService = TestBed.get(DecoratorEventService);
    timeService = TestBed.get(DecoratorTimeService);
    loaderService = TestBed.get(DecoratorLoaderService);
    stateService = TestBed.get(DecoratorStateService);
  });

  it('should have made a post request only for link speed decorator', () => {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [LinkDecoratorTypeEnum.LinkSpeedDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData({value: 1}));

    loaderService.loadAllDecorators([1], [2], [3]);
    expect(httpClientSpy.post)
      .toHaveBeenCalledTimes(1);
  });


  it('should have created link speed decorators without error', testAsync(async function () {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [LinkDecoratorTypeEnum.LinkSpeedDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        links_decorators: [
          {
            link_id: 3,
            value: 1
          }
        ]
      }));
    await loaderService.loadAllDecorators([1], [2], [3]);

    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledTimes(1);
    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledWith(DecoratorCategoryEnum.LinkDecorators, [LinkDecoratorTypeEnum.LinkSpeedDecorator], [new LinkSpeedDecorator(3, 1)]);
  }));

  it('should have returned error after wrong response from server', testAsync(async function () {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [LinkDecoratorTypeEnum.LinkSpeedDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        error: 404
      }));

    await loaderService.loadAllDecorators([1], [2], [3]);

    expect(eventService.triggerLinkDecoratorsRemoved)
      .toHaveBeenCalledTimes(1);
    expect(eventService.triggerLinkDecoratorsRemoved)
      .toHaveBeenCalledWith(DecoratorCategoryEnum.LinkDecorators, [LinkDecoratorTypeEnum.LinkSpeedDecorator]);
  }));


  it('should have created multiple link speed decorators without error', testAsync(async function () {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [LinkDecoratorTypeEnum.LinkSpeedDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        links_decorators: [
          {
            link_id: 3,
            value: 1
          },
          {
            link_id: 4,
            value: 150
          }
        ]
      }));

    await loaderService.loadAllDecorators([1], [2], [3, 4]);

    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledTimes(1);
    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledWith(DecoratorCategoryEnum.LinkDecorators,
        [LinkDecoratorTypeEnum.LinkSpeedDecorator],
        [new LinkSpeedDecorator(3, 1), new LinkSpeedDecorator(4, 150)]);
  }));

  it('should have done nothing if empty array of ids was passed', testAsync(async function () {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [LinkDecoratorTypeEnum.LinkSpeedDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        links_decorators: [
          {
            link_id: 3,
            value: 1
          }
        ]
      }));

    await loaderService.loadAllDecorators([], [], []);

    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledTimes(0);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(0);
  }));

  it('should have created specifically requested link speed decorators without error even though it was filtered', testAsync(async function () {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        links_decorators: [
          {
            link_id: 3,
            value: 1
          }
        ]
      }));
    await loaderService.loadLinkDecoratorsOfType([3], LinkDecoratorTypeEnum.LinkSpeedDecorator);

    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledTimes(1);
    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledWith(DecoratorCategoryEnum.LinkDecorators, [LinkDecoratorTypeEnum.LinkSpeedDecorator], [new LinkSpeedDecorator(3, 1)]);
  }));

  it('should have created only link decorators', testAsync(async function () {
    const routerTypes = Object.values(RouterNodeDecoratorTypeEnum);
    const hostTypes = Object.values(HostNodeDecoratorTypeEnum);
    const linkTypes = [LinkDecoratorTypeEnum.LinkSpeedDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        links_decorators: [
          {
            link_id: 3,
            value: 1
          }
        ]
      }));
    await loaderService.loadLinkDecorators([3]);

    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledTimes(1);
    expect(eventService.triggerNodeDecoratorsLoaded)
      .toHaveBeenCalledTimes(0);
    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledWith(DecoratorCategoryEnum.LinkDecorators, [LinkDecoratorTypeEnum.LinkSpeedDecorator], [new LinkSpeedDecorator(3, 1)]);
  }));


// TESTS BELOW WILL ALWAYS FAIL BECAUSE THE FUNCTIONALITY IS NOT YET SUPPORTED BY THE SERVER

  /*
  it('should have created link mail decorators without error', testAsync(async function() {
    const routerTypes = [];
    const hostTypes = [];
    const linkTypes = [LinkDecoratorTypeEnum.LinkMailDecorator];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData(
      {
        links_decorators: [
          {
            link_id: 3,
            value: 1
          }
        ]
      }));

    await loaderService.loadAllDecorators([1], [2], [3]);

    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledTimes(1);
    expect(eventService.triggerLinkDecoratorsLoaded)
      .toHaveBeenCalledWith(DecoratorCategoryEnum.LinkDecorators, [LinkDecoratorTypeEnum.LinkMailDecorator], [new LinkMailDecorator(3, 1)]);
  }));
  */

  /*it('should make a post request only for host node logical role decorator', () => {
    const routerTypes = [];
    const hostTypes = [HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator];
    const linkTypes = [];

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData({value: 1}));

    loaderService.loadAllDecorators([1], [2], [3]);
    expect(httpClientSpy.post)
      .toHaveBeenCalledTimes(1);
  });*/

  /*it('should make a post request for every decorator type', () => {
    const routerTypes = Object.values(RouterNodeDecoratorTypeEnum);
    const hostTypes = Object.values(HostNodeDecoratorTypeEnum);
    const linkTypes = Object.values(LinkDecoratorTypeEnum);

    spyOn(filterService, 'getActiveRouterDecorators')
      .and.returnValue(routerTypes);
    spyOn(filterService, 'getActiveHostDecorators')
      .and.returnValue(hostTypes);
    spyOn(filterService, 'getActiveLinkDecorators')
      .and.returnValue(linkTypes);

    httpClientSpy.post.and.returnValue(asyncData({value: 1}));

    loaderService.loadAllDecorators([1], [2], [3]);
    expect(httpClientSpy.post)
      .toHaveBeenCalledTimes(routerTypes.length + hostTypes.length + linkTypes.length)
  });*/
});
