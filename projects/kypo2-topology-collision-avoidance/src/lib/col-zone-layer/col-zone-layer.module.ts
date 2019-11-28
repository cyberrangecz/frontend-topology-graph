import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColZoneLayerComponent } from './col-zone-layer.component';
import { NodeNodeLayerComponent } from './node-node-layer/node-node-layer.component';
import { NodeLinkLayerComponent } from './node-link-layer/node-link-layer.component';
import { SettingsService } from '../services/settings.service';
import { LinkNodeLayerComponent } from './link-node-layer/link-node-layer.component';
import { LinkLinkLayerComponent } from './link-link-layer/link-link-layer.component';
import { SubnetNodeLayerComponent } from './subnet-node-layer/subnet-node-layer.component';
import { SubnetLinkLayerComponent } from './subnet-link-layer/subnet-link-layer.component';
import { LinkHostLayerComponent } from './link-host-layer/link-host-layer.component';

@NgModule({
  declarations: [
    ColZoneLayerComponent,
    NodeLinkLayerComponent,
    NodeNodeLayerComponent,
    LinkNodeLayerComponent,
    LinkLinkLayerComponent,
    SubnetNodeLayerComponent,
    SubnetLinkLayerComponent,
    LinkHostLayerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ColZoneLayerComponent
  ],
  providers: [
    SettingsService,
  ]
})
export class ColZoneLayerModule { }
