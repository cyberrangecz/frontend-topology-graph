import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KypoTopologyLegendComponent } from '../legend/kypo-topology-legend.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [CommonModule, MatCardModule],
  declarations: [KypoTopologyLegendComponent],
  providers: [],
  exports: [KypoTopologyLegendComponent],
})
export class KypoTopologyLegendModule {}
