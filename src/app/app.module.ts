import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {GraphModule} from '../../projects/graph-topology/src/public_api';
import {CustomTopologyConfig} from './graph-topology-config';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphModule.forRoot(new CustomTopologyConfig())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
