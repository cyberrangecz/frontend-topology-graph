import { NgModule } from '@angular/core';
import { ContextMenuDirective } from './context-menu.directive';
import { DraggableDirective } from './draggable.directive';
import { ZoomableDirective } from './zoomable.directive';
import {DisableControlDirective} from './disable-control.directive';

@NgModule({
  declarations: [
    ContextMenuDirective,
    DraggableDirective,
    ZoomableDirective,
    DisableControlDirective
  ],
  exports: [
    ContextMenuDirective,
    DraggableDirective,
    ZoomableDirective,
    DisableControlDirective
  ]
})

export class DirectivesModule {}
