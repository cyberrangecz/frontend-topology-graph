import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyApi } from './services/topology-api.service';
import { TopologyMapper } from './services/topology-mapper.service';
import { Kypo2TopologyLoadingService } from './services/kypo2-topology-loading.service';
import { Kypo2TopologyErrorService } from './services/kypo2-topology-error.service';
import { ConfigService } from './services/config.service';
import { Kypo2TopologyGraphConfig } from './others/kypo2TopologyGraphConfig';

@NgModule({
  imports: [CommonModule],
  providers: [
    TopologyApi,
    TopologyMapper,
    Kypo2TopologyLoadingService,
    Kypo2TopologyErrorService,
    Kypo2TopologyGraphConfig,
    ConfigService,
  ],
})
export class TopologyApiModule {
  constructor(@Optional() @SkipSelf() parentModule: TopologyApiModule) {
    if (parentModule) {
      throw new Error('TopologyApiModule is already loaded. Import it only once in single module hierarchy.');
    }
  }

  static forRoot(config: Kypo2TopologyGraphConfig): ModuleWithProviders<TopologyApiModule> {
    return {
      ngModule: TopologyApiModule,
      providers: [{ provide: Kypo2TopologyGraphConfig, useValue: config }],
    };
  }
}
