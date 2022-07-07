import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorFilterMenuComponent } from './force-graph-sidebar/decorator-filter-menu/decorator-filter-menu.component';
import { AbsoluteTimeComponent } from './force-graph-sidebar/decorator-time-picker/absolute-time/absolute-time.component';
import { RelativeTimeComponent } from './force-graph-sidebar/decorator-time-picker/relative-time/relative-time.component';
import { LayoutTabComponent } from './force-graph-sidebar/layout-tab/layout-tab.component';
import { TopologyGraphSidebarComponent } from './force-graph-sidebar/topology-graph-sidebar.component';
import { DecoratorTimePickerComponent } from './force-graph-sidebar/decorator-time-picker/decorator-time-picker.component';
import { DecoratorTimerComponent } from './force-graph-sidebar/decorator-timer/decorator-timer.component';
import { KypoTopologyGraphComponent } from './kypo-topology-graph.component';
import { TopologyApi } from '../services/topology-api.service';
import { GraphVisualComponentsModule } from '../visuals/graph-visual-components.module';
import { GraphMaterialModule } from './graph-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { KypoTopologyGraphConfig } from '../others/kypoTopologyGraphConfig';
import { ConfigService } from '../services/config.service';
import { TopologyMapper } from '../services/topology-mapper.service';
import { KypoTopologyLoadingService } from '../services/kypo-topology-loading.service';
import { KypoTopologyErrorService } from '../services/kypo-topology-error.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GraphMaterialModule,
    GraphVisualComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    TopologyGraphSidebarComponent,
    DecoratorFilterMenuComponent,
    KypoTopologyGraphComponent,
    DecoratorTimerComponent,
    LayoutTabComponent,
    DecoratorTimePickerComponent,
    AbsoluteTimeComponent,
    RelativeTimeComponent,
  ],
  providers: [ConfigService, TopologyApi, TopologyMapper, KypoTopologyLoadingService, KypoTopologyErrorService],
  exports: [KypoTopologyGraphComponent],
})
export class KypoTopologyGraphModule {
  constructor(@Optional() @SkipSelf() parentModule: KypoTopologyGraphModule) {
    if (parentModule) {
      throw new Error('TopologyGraphModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: KypoTopologyGraphConfig): ModuleWithProviders<KypoTopologyGraphModule> {
    return {
      ngModule: KypoTopologyGraphModule,
      providers: [{ provide: KypoTopologyGraphConfig, useValue: config }],
    };
  }
}
