import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DecoratorFilterMenuComponent} from './force-graph-sidebar/decorator-filter-menu/decorator-filter-menu.component';
import {AbsoluteTimeComponent} from './force-graph-sidebar/decorator-time-picker/absolute-time/absolute-time.component';
import {RelativeTimeComponent} from './force-graph-sidebar/decorator-time-picker/relative-time/relative-time.component';
import {LayoutTabComponent} from './force-graph-sidebar/layout-tab/layout-tab.component';
import {TopologyGraphSidebarComponent} from './force-graph-sidebar/topology-graph-sidebar.component';
import {DecoratorTimePickerComponent} from './force-graph-sidebar/decorator-time-picker/decorator-time-picker.component';
import {DecoratorTimerComponent} from './force-graph-sidebar/decorator-timer/decorator-timer.component';
import {Kypo2TopologyGraphComponent} from './kypo2-topology-graph.component';
import {DecoratorReloadTimerService} from '../services/decorator-reload-timer.service';
import {DecoratorFilterService} from '../services/decorator-filter.service';
import {D3Service} from '../services/d3.service';
import {ContextMenuService} from '../services/context-menu.service';
import {TopologyFacade} from '../services/topology-facade.service';
import {DecoratorFacade} from '../services/decorator-facade.service';
import {DecoratorEventService} from '../services/decorator-event.service';
import {DecoratorTimeService} from '../services/decorator-time.service';
import {D3ZoomEventService} from '../services/d3-zoom-event.service';
import {GraphEventService} from '../services/graph-event.service';
import {GraphVisualComponentsModule} from '../visuals/graph-visual-components.module';
import {GraphMaterialModule} from './graph-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DecoratorStateService} from '../services/decorator-state.service';
import {DirectivesModule} from '../directives/directives.module';
import {GraphLockService} from '../services/graph-lock.service';
import {Kypo2TopologyGraphConfig} from '../others/kypo2TopologyGraphConfig';
import {ConfigService} from '../services/config.service';
import {HostService} from '../services/host.service';
import {DraggedNodeService} from '../services/dragged-node.service';
import {TopologyMapper} from '../services/topology-mapper.service';
import {SandboxService} from '../services/sandbox.service';
import {Kypo2TopologyLoadingService} from '../services/kypo2-topology-loading.service';
import {Kypo2TopologyErrorService} from '../services/kypo2-topology-error.service';
import { VisibilityMenuModule } from 'tca-lib';
import { SettingsService } from 'tca-lib';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GraphMaterialModule,
    GraphVisualComponentsModule,
    DirectivesModule,
    VisibilityMenuModule
  ],
  declarations: [
    TopologyGraphSidebarComponent,
    DecoratorFilterMenuComponent,
    Kypo2TopologyGraphComponent,
    DecoratorTimerComponent,
    LayoutTabComponent,
    DecoratorTimePickerComponent,
    AbsoluteTimeComponent,
    RelativeTimeComponent,
  ],
  providers: [
    ConfigService,
    SandboxService,
    Kypo2TopologyLoadingService,
    Kypo2TopologyErrorService,
    HostService,
    D3Service,
    D3ZoomEventService,
    ContextMenuService,
    TopologyFacade,
    TopologyMapper,
    DecoratorReloadTimerService,
    DecoratorFacade,
    DecoratorEventService,
    DecoratorFilterService,
    DecoratorTimeService,
    DecoratorStateService,
    GraphEventService,
    GraphLockService,
    DraggedNodeService,
    SettingsService
  ],
  exports: [
    Kypo2TopologyGraphComponent
  ]
})
export class Kypo2TopologyGraphModule {
  constructor (@Optional() @SkipSelf() parentModule: Kypo2TopologyGraphModule) {
    if (parentModule) {
      throw new Error(
        'TopologyGraphModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: Kypo2TopologyGraphConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2TopologyGraphModule,
      providers: [
        { provide: Kypo2TopologyGraphConfig, useValue: config }
        ]
    };
  }
}
