import {DecoratorFilterService} from '../decorator-filter.service';
import {DecoratorEventService} from '../decorator-event.service';
import {RouterNodeDecoratorTypeEnum} from '../../model/enums/router-node-decorator-type-enum';
import {HostNodeDecoratorTypeEnum} from '../../model/enums/host-node-decorator-type-enum';
import {DecoratorCategoryEnum} from '../../model/enums/decorator-category-enum';
import {LinkDecoratorTypeEnum} from '../../model/enums/link-decorator-type-enum';
import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';

let filterService: DecoratorFilterService;
let eventService: DecoratorEventService;

describe('Decorator filter service', () => {
  beforeEach(() => {
    const eventServiceSpy = jasmine.createSpyObj(
      'DecoratorEventService',
      [
        'triggerNodeDecoratorsRemoved',
        'triggerLinkDecoratorsRemoved',
        'triggerDecoratorReloadRequest'
      ]);
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        DecoratorFilterService,
        {provide: DecoratorEventService, useValue: eventServiceSpy}
      ]
    });

    filterService = TestBed.get(DecoratorFilterService);
    eventService = TestBed.get(DecoratorEventService);

  });

  it('should have all router node decorator types active on creation', () => {
    const expectedDecoratorTypes = Object.values(RouterNodeDecoratorTypeEnum);
    expect(filterService['_routerDecorators']).toEqual(expectedDecoratorTypes);
  });

  it('should have all host node decorator types active on creation', () => {
    const expectedDecoratorTypes = Object.values(HostNodeDecoratorTypeEnum);
    expect(filterService['_hostDecorators']).toEqual(expectedDecoratorTypes);
  });

  it('should have all link decorator types active on creation', () => {
    const expectedDecoratorTypes = Object.values(LinkDecoratorTypeEnum);
    expect(filterService['_linkDecorators']).toEqual(expectedDecoratorTypes);
  });

  it('should have all router node decorator types non-active', () => {
    filterService.removeAll(DecoratorCategoryEnum.RouterDecorators);
    expect(filterService['_routerDecorators'].length).toEqual(0);
  });

  it('should have all host node decorator types non-active', () => {
    filterService.removeAll(DecoratorCategoryEnum.HostDecorators);
    expect(filterService['_hostDecorators'].length).toEqual(0);
  });

  it('should have all link decorator types non-active', () => {
    filterService.removeAll(DecoratorCategoryEnum.LinkDecorators);
    expect(filterService['_linkDecorators'].length).toEqual(0);
  });

  it('should have removed logical role decorator type from active router node decorators', () => {
    filterService.remove(DecoratorCategoryEnum.RouterDecorators, RouterNodeDecoratorTypeEnum.LogicalRoleDecorator);
    expect(filterService['_routerDecorators']).not.toContain(RouterNodeDecoratorTypeEnum.LogicalRoleDecorator);
  });

  it('should have removed semaphore decorator type from active host node decorators', () => {
    filterService.remove(DecoratorCategoryEnum.HostDecorators, HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator);
    expect(filterService['_hostDecorators']).not.toContain(HostNodeDecoratorTypeEnum.NodeSemaphoreDecorator);
  });

  it('should have removed speed decorator type from active link decorators', () => {
    filterService.remove(DecoratorCategoryEnum.LinkDecorators, LinkDecoratorTypeEnum.LinkSpeedDecorator);
    expect(filterService['_linkDecorators']).not.toContain(LinkDecoratorTypeEnum.LinkSpeedDecorator);
  });

  it('should have added logical role to active router node decorator types', () => {
    filterService['_routerDecorators'] = [];
    filterService.add(DecoratorCategoryEnum.RouterDecorators, RouterNodeDecoratorTypeEnum.LogicalRoleDecorator);
    expect(filterService['_routerDecorators']).toEqual([RouterNodeDecoratorTypeEnum.LogicalRoleDecorator]);
  });

  it('should have added logical role to active host node decorator types', () => {
    filterService['_hostDecorators'] = [];
    filterService.add(DecoratorCategoryEnum.HostDecorators, HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator);
    expect(filterService['_hostDecorators']).toEqual([HostNodeDecoratorTypeEnum.NodeLogicalRoleDecorator]);
  });

  it('should have added speed decorator to active link decorator types', () => {
    filterService['_linkDecorators'] = [];
    filterService.add(DecoratorCategoryEnum.LinkDecorators, LinkDecoratorTypeEnum.LinkSpeedDecorator);
    expect(filterService['_linkDecorators']).toEqual([LinkDecoratorTypeEnum.LinkSpeedDecorator]);
  });
});
