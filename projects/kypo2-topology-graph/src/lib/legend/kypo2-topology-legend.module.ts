import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Kypo2TopologyLegendComponent} from "../legend/kypo2-topology-legend.component";
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule
  ],
  declarations: [
    Kypo2TopologyLegendComponent
  ],
  providers: [],
  exports: [
    Kypo2TopologyLegendComponent
  ]
})
export class Kypo2TopologyLegendModule {}
