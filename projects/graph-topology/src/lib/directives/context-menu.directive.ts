import { Directive, Input } from '@angular/core';
import { D3Service } from '../services/d3.service';
import { ContextMenuService } from '../services/context-menu.service';
import { GraphNodeVisualComponent } from '../visuals/graph-node-visual/graph-node-visual.component';
import { HostNode } from '../model/node/host-node';

/**
 * Directive for marking objects with context menu
 */
@Directive({
  selector: '[contextMenu]',
  host:{'(contextmenu)': 'rightClicked($event)'}

})

export class ContextMenuDirective {

  @Input('contextMenu') visualNode: GraphNodeVisualComponent;

  constructor(private contextMenuService: ContextMenuService, private d3Service: D3Service) {
  }

  /**
   * Reacts on right click - shows context menu and closes other if it was already open
   * Notifies about context menu service about click.
   * @param {MouseEvent} event
   */
  rightClicked(event: MouseEvent) {
    if (this.visualNode.node instanceof HostNode) {
      this.visualNode.showContextMenu = !this.visualNode.showContextMenu;
      this.contextMenuService.show.next({event: event, obj: this.visualNode.contextMenuItems});
    }
    event.preventDefault();
  }
}
