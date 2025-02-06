import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyPageComponent } from './topology-page.component';
import {
    KypoTopologyGraphModule
} from '../../../../projects/kypo-topology-graph/src/lib/graph/kypo-topology-graph.module';
import { CustomTopologyConfig } from '../../graph-topology-config';
import {
    KypoTopologyLegendModule
} from '../../../../projects/kypo-topology-graph/src/lib/legend/kypo-topology-legend.module';
import { TopologyPageRoutingModule } from './topology-page-routing.module';


@NgModule({
    declarations: [TopologyPageComponent],
    imports: [
        CommonModule,
        TopologyPageRoutingModule,
        KypoTopologyGraphModule.forRoot(CustomTopologyConfig),
        KypoTopologyLegendModule,
    ]
})
export class TopologyPageModule {
}
