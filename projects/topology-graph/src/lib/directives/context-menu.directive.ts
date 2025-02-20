import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuService } from '../services/context-menu.service';
import { Node } from '@crczp/topology-model';

/**
 * Directive for marking objects with context menu
 */
@Directive({
  selector: '[contextMenu]',
})
export class ContextMenuDirective {
  @Input('contextMenu') node: Node;

  constructor(private contextMenuService: ContextMenuService) {}

  /**
   * Reacts on right click - shows context menu and closes other if it was already open
   * Notifies about context menu service about click.
   * @param {MouseEvent} event
   */
  @HostListener('contextmenu', ['$event'])
  rightClicked(event: MouseEvent) {
    this.contextMenuService.show.next({
      position: {
        x: event.offsetX,
        y: event.offsetY,
      },
      nodeName: this.node.name,
    });
    event.preventDefault();
  }
}
