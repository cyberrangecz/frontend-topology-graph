import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyApi } from './services/topology-api.service';
import { TopologyMapper } from './services/topology-mapper.service';
import { KypoTopologyLoadingService } from './services/kypo-topology-loading.service';
import { KypoTopologyErrorService } from './services/kypo-topology-error.service';
import { ConfigService } from './services/config.service';
import { KypoTopologyGraphConfig } from './others/kypoTopologyGraphConfig';

@NgModule({
  imports: [CommonModule],
  providers: [
    TopologyApi,
    TopologyMapper,
    KypoTopologyLoadingService,
    KypoTopologyErrorService,
    KypoTopologyGraphConfig,
    ConfigService,
  ],
})
export class TopologyApiModule {
  constructor(@Optional() @SkipSelf() parentModule: TopologyApiModule) {
    if (parentModule) {
      throw new Error('TopologyApiModule is already loaded. Import it only once in single module hierarchy.');
    }
  }

  static forRoot(config: KypoTopologyGraphConfig): ModuleWithProviders<TopologyApiModule> {
    return {
      ngModule: TopologyApiModule,
      providers: [{ provide: KypoTopologyGraphConfig, useValue: config }],
    };
  }
}
