import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecoratorFilterMenuComponent } from './force-graph-sidebar/decorator-filter-menu/decorator-filter-menu.component';
import { AbsoluteTimeComponent } from './force-graph-sidebar/decorator-time-picker/absolute-time/absolute-time.component';
import { RelativeTimeComponent } from './force-graph-sidebar/decorator-time-picker/relative-time/relative-time.component';
import { LayoutTabComponent } from './force-graph-sidebar/layout-tab/layout-tab.component';
import { TopologyGraphSidebarComponent } from './force-graph-sidebar/topology-graph-sidebar.component';
import { DecoratorTimePickerComponent } from './force-graph-sidebar/decorator-time-picker/decorator-time-picker.component';
import { DecoratorTimerComponent } from './force-graph-sidebar/decorator-timer/decorator-timer.component';
import { TopologyGraphComponent } from './topology-graph.component';
import { TopologyApi } from '../services/topology-api.service';
import { GraphVisualComponentsModule } from '../visuals/graph-visual-components.module';
import { GraphMaterialModule } from './graph-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { TopologyGraphConfig } from '../others/topology-graph-config';
import { ConfigService } from '../services/config.service';
import { TopologyMapper } from '../services/topology-mapper.service';
import { TopologyLoadingService } from '../services/topology-loading.service';
import { TopologyErrorService } from '../services/topology-error.service';
import { TopologyLegendModule } from '../legend/topology-legend.module';
import { LogoSpinnerComponent } from '@crczp/theme';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GraphMaterialModule,
    GraphVisualComponentsModule,
    DirectivesModule,
    TopologyLegendModule,
    LogoSpinnerComponent
  ],
  declarations: [
    TopologyGraphSidebarComponent,
    DecoratorFilterMenuComponent,
    TopologyGraphComponent,
    DecoratorTimerComponent,
    LayoutTabComponent,
    DecoratorTimePickerComponent,
    AbsoluteTimeComponent,
    RelativeTimeComponent,
  ],
  providers: [ConfigService, TopologyApi, TopologyMapper, TopologyLoadingService, TopologyErrorService],
  exports: [TopologyGraphComponent],
})
export class TopologyGraphModule {
  constructor(@Optional() @SkipSelf() parentModule: TopologyGraphModule) {
    if (parentModule) {
      throw new Error('TopologyGraphModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: TopologyGraphConfig): ModuleWithProviders<TopologyGraphModule> {
    return {
      ngModule: TopologyGraphModule,
      providers: [{ provide: TopologyGraphConfig, useValue: config }],
    };
  }
}
