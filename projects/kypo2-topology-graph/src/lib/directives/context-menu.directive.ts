import { Directive, Input } from '@angular/core';
import { ContextMenuService } from '../services/context-menu.service';
import { Node } from 'kypo2-topology-graph-model';


/**
 * Directive for marking objects with context menu
 */
@Directive({
  selector: '[contextMenu]',
  host:{'(contextmenu)': 'rightClicked($event)'}
})

export class ContextMenuDirective {

  @Input('contextMenu') node: Node;
  constructor(private contextMenuService: ContextMenuService) {

  }

  /**
   * Reacts on right click - shows context menu and closes other if it was already open
   * Notifies about context menu service about click.
   * @param {MouseEvent} event
   */
  rightClicked(event: MouseEvent) {
    this.contextMenuService.show.next({
      position: {
        x: this.node.x,
        y: this.node.y
      },
      nodeName: this.node.name,
    });
    event.preventDefault();
  }
}
