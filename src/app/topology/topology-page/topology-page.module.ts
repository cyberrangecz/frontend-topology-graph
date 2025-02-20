import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyPageComponent } from './topology-page.component';
import { TopologyGraphModule } from '../../../../projects/topology-graph/src/lib/graph/topology-graph.module';
import { TopologyLegendModule } from '../../../../projects/topology-graph/src/lib/legend/topology-legend.module';
import { TopologyPageRoutingModule } from './topology-page-routing.module';
import { environment } from '../../../environments/environment';


@NgModule({
    declarations: [TopologyPageComponent],
    imports: [
        CommonModule,
        TopologyPageRoutingModule,
        TopologyGraphModule.forRoot(environment.topologyConfig),
        TopologyLegendModule,
    ]
})
export class TopologyPageModule {
}
