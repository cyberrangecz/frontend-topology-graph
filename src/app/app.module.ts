import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {GraphModule} from '../../projects/graph-topology/src/public_api';
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
    GraphModule.forRoot(CustomTopologyConfig),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
