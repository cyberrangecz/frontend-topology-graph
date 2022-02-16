import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopologyPageComponent} from './topology-page.component';
import {Kypo2TopologyGraphModule} from "../../../../projects/kypo2-topology-graph/src/lib/graph/kypo2-topology-graph.module";
import {CustomTopologyConfig} from "../../graph-topology-config";
import {Kypo2TopologyLegendModule} from "../../../../projects/kypo2-topology-graph/src/lib/legend/kypo2-topology-legend.module";
import {TopologyPageRoutingModule} from "./topology-page-routing.module";



@NgModule({
  declarations: [TopologyPageComponent],
  imports: [
    CommonModule,
    TopologyPageRoutingModule,
    Kypo2TopologyGraphModule.forRoot(CustomTopologyConfig),
    Kypo2TopologyLegendModule,
  ]
})
export class TopologyPageModule { }
