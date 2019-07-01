import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {Kypo2TopologyGraphModule} from '../../projects/kypo2-topology-graph/src/public_api';
import {CustomTopologyConfig} from './graph-topology-config';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    Kypo2TopologyGraphModule.forRoot(CustomTopologyConfig),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
