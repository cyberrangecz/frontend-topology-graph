import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuService } from '../services/context-menu.service';
import { Node } from '@crczp/topology-graph-model';

/**
 * Directive for marking objects with context menu
 */
@Directive({
    selector: '[contextMenu]',
})
export class ContextMenuDirective {
    @Input('contextMenu') node: Node;
    @Input('contextMenuZoom') zoom: number;

    constructor(private contextMenuService: ContextMenuService) {}

    /**
     * Reacts on right click - shows context menu and closes other if it was already open
     * Notifies about context menu service about click.
     * @param {MouseEvent} event - event of right click
     * @param {number} zoom - zoom of the graph
     */
    @HostListener('contextmenu', ['$event'])
    rightClicked(event: MouseEvent) {
        console.log('rightClicked', this.zoom);
        this.contextMenuService.show.next({
            position: {
                x: event.offsetX * this.zoom,
                y: event.offsetY * this.zoom,
            },
            nodeName: this.node.name,
        });
        event.preventDefault();
    }
}
